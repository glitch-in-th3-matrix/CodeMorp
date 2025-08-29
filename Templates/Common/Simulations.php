<?php
    include_once "../Basic/Utils.php";

    $id = $_GET["id"] ?? null;
    $success = $_GET["success"] ?? null;
    $message = $success ? "Simulation $success!" : null;

    if ($id) {
        $qry_1 = "select * from simulations where id = $id";
        $simulation = $connection->query($qry_1)->fetch_assoc();
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        extract(array_map("cleanInput", $_POST), EXTR_OVERWRITE);        
        $steps = json_encode(
            array_values(array_filter(
                $steps, 
                fn($step) => $step !== ""
            )), 
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
   
        try {
            if (isset($_POST["add"])) {
                $qry_2 = "insert into simulations values ('', '$title', '$description', '$code',
                          '$steps', '$user_email', 0)";
                $success = "added";
            } else {
                $qry_2 = "update simulations set title = '$title', description = '$description',
                          code = '$code', steps = '$steps' where id = $id";
                $success = "updated";
            }
            $connection->query($qry_2);

            header("Location: ./Simulations.php?success=$success");
            exit;

        } catch (mysqli_sql_exception $e) {
            if ($e->getCode() === 1062) {
                unset($success);
                $message = "This simulation is already added!";
            } else {
                $message = $e->getMessage();
            }
        }
    }

    $qry_3 = $user_type == "admin"
             ? "select * from simulations where status = 0"
             : ($user_type == "teacher"
                ? "select * from simulations where uploaded_by = '$user_email'"
                : "select simulations.* from simulations
                   join teachers on simulations.uploaded_by = teachers.email
                   join students on teachers.department = students.department
                   where students.email = '$user_email'");
    $simulations = $connection->query($qry_3);

    include_once "../Basic/Head.php";
    include_once "../Basic/Menu.php";
?>

<div class="content-wrapper">
    <div class="container-fluid">

        <?php if ($message): ?>
            <div class="alert alert-danger alert-dismissible <?= $success ?>" role="alert">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <div class="alert-icon">
                    <i class="icon-info"></i>
                </div>
                <div class="alert-message">
                    <span><strong><?= $message ?></strong></span>
                </div>
            </div>
        <?php endif; ?>

        <?php if (canManage("simulation")): ?>
            <div class="row mt-3">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-title"><?= $id ? "Update" : "Add" ?> Simulation</div>
                            <hr>
                            <form method="post" class="row" enctype="multipart/form-data">
                                <div class="form-group col-lg-12">
                                    <label for="title">Title</label>
                                    <input type="text" name="title" class="form-control" 
                                        id="title" value="<?= $simulation["title"] ?? null ?>" required>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="description">Description</label>
                                    <textarea name="description" class="form-control" 
                                        id="description" required><?= $simulation["description"] ?? null ?></textarea>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="code">Code</label>
                                    <textarea name="code" class="form-control" 
                                        id="code" required><?= $simulation["code"] ?? null ?></textarea>
                                </div>
                                <div class="steps-wrap col-lg-12">
                                    <?php if ($id): ?>
                                        <div class="form-group">
                                            <label for="steps">Steps</label>
                                        </div>
                                        <?php foreach(json_decode($simulation["steps"]) as $step): ?>
                                            <div class="form-group">
                                                <input type="text" name="steps[]" class="form-control" 
                                                    value="<?= $step ?>" required>
                                            </div>
                                        <?php endforeach;?>
                                    <?php else: ?>
                                        <div class="form-group">
                                            <label for="steps">Steps</label>
                                            <input type="text" name="steps[]" class="form-control" 
                                                id="steps" required>
                                        </div>
                                    <?php endif; ?>
                                    <div class="plus-wrap">
                                        <button type="button" class="btn add-step" title="Add Step">+</button>
                                    </div>
                                </div>
                                <div class="form-group submit-box col-lg-12">
                                    <?php if ($id): ?>
                                        <input type="submit" name="update" class="btn btn-light px-5"
                                            value="Update Simulation">
                                    <?php else: ?>
                                        <input type="submit" name="add" class="btn btn-light px-5"
                                            value="Add Simulation">
                                    <?php endif; ?>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <div class="row">
            <div class="col-12 col-lg-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mt-2">Simulations</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table align-items-center table-hover table-borderless">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th></th>
                                    <?php if (canManage("simulation")): ?>
                                        <th></th>
                                        <th></th>
                                    <?php endif; ?>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($simulations->num_rows): ?>
                                    <?php $count = 1; ?>
                                    <?php while ($simulation = $simulations->fetch_assoc()): ?>
                                        <tr>
                                            <td><?= $count++ ?></td>
                                            <td class="simulation-title">
                                                <p><?= $simulation["title"] ?></p>
                                            </td>
                                            <td class="simulation-description">
                                                <p><?= $simulation["description"] ?></p>
                                            </td>
                                            <td>
                                                <div class="alert-icon">
                                                    <a href="../Common/Simulation.php?id=<?= $simulation["id"] ?>" 
                                                        title="View Simulation">
                                                            <i class="bi bi-image"></i></a>
                                                </div>
                                            </td>
                                            <?php if (canManage("simulation")): ?>
                                                <td>
                                                    <div class="alert-icon">
                                                        <a href="./Simulations.php?id=<?= $simulation["id"] ?>"
                                                            title="Edit Simulation">
                                                            <i class="bi bi-pencil-square"></i>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="alert-icon">
                                                        <a href="#" class="delete-item" data-type="simulation" 
                                                            data-id="<?= $simulation["id"] ?>" title="Delete Simulation">
                                                            <i class="bi bi-trash"></i></a>
                                                    </div>
                                                </td>
                                            <?php endif; ?>
                                        </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="5" class="empty">No Simulations Added!</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="overlay toggle-menu"></div>

    </div>
</div>


<?php
    include_once "../Basic/Footer.php";
?>
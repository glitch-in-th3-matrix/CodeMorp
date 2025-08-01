<?php
    include_once "../Basic/Utils.php";

    $id = $_GET["id"] ?? null;
    $success = $_GET["success"] ?? null;
    $message = $success ? "Material $success!" : null;

    if ($id) {
        $qry_1 = "select * from study_materials where id = $id";
        $study_material = $connection->query($qry_1)->fetch_assoc();
    }
    
    $qry_2 = "select department from {$user_type}s where email = '$user_email'";
    $user_department = $connection->query($qry_2)->fetch_assoc()["department"];

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $title = cleanInput($_POST["title"]);
        $material = $_FILES["material"];

        $material_location = "../../Media/StudyMaterials";
        $material_extension = pathinfo($material["name"], PATHINFO_EXTENSION);
        $material_name = uniqid("", true) . ".{$material_extension}";
        $material_path = "$material_location/$material_name";

        try {
            if (isset($_POST["add"])) {
                $qry_3 = "insert into study_materials values ('', '$title', $user_department,
                          '$user_email', '$material_name')";
                $success = "added";
            } else {
                $qry_3 = "update study_materials set title = '$title', material = '$material_name'
                          where id = $id";
                $success = "updated";
            }
            $connection->query($qry_3);

            @unlink("../../Media/StudyMaterials/{$study_material['material']}");
            move_uploaded_file($material["tmp_name"], $material_path);

            header("Location: ./StudyMaterials.php?success=$success");
            exit;

        } catch (mysqli_sql_exception $e) {
            if ($e->getCode() === 1062) {
                unset($success);
                $message = "This material is already added";
            }
        }
    }

    $qry_4 = ($user_type == "teacher")
             ? "select * from study_materials where uploaded_by = '$user_email'
                order by id desc"
             : "select * from study_materials where department = $user_department
                order by id desc";
    $study_materials = $connection->query($qry_4);

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

        <?php if (canManage("study_material")): ?>
            <div class="row mt-3">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-title">Add Study Material</div>
                            <hr>
                            <form method="post" class="row" enctype="multipart/form-data">
                                <div class="form-group col-lg-6">
                                    <label for="title">Title</label>
                                    <input type="text" name="title" class="form-control" 
                                        id="title" value="<?= $study_material["title"] ?? null ?>" required>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="material">Material</label>
                                    <input type="file" name="material" class="form-control" 
                                        id="material" accept=".pdf, .doc, .docx, .txt" required>
                                </div>
                                <div class="form-group submit-box col-lg-12">
                                    <?php if ($id): ?>
                                        <input type="submit" name="update" class="btn btn-light px-5"
                                            value="Update Material">
                                    <?php else: ?>
                                        <input type="submit" name="add" class="btn btn-light px-5"
                                            value="Add Material">
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
                        <h5 class="mt-2">Study Materials</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table align-items-center table-hover table-borderless">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th></th>
                                    <th></th>
                                    <?php if (canManage("study_material")): ?>
                                        <th></th>
                                        <th></th>
                                    <?php endif; ?>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($study_materials->num_rows): ?>
                                    <?php $count = 1; ?>
                                    <?php while ($material = $study_materials->fetch_assoc()): ?>
                                        <tr>
                                            <td><?= $count++ ?></td>
                                            <td class="title"><?= $material["title"] ?></td>
                                            <td>
                                                <a href="../../Media/StudyMaterials/<?= $material["material"] ?>" 
                                                    class="btn" target="_blank">View</a>
                                            </td>
                                            <td>
                                                <a href="../../Media/StudyMaterials/<?= $material["material"] ?>" 
                                                    class="btn" download>Download</a>
                                            </td>
                                            <?php if (canManage("study_material")): ?>
                                                <td>
                                                    <div class="alert-icon">
                                                        <a href="./StudyMaterials.php?id=<?= $material["id"] ?>"
                                                            title="Edit Material">
                                                            <i class="bi bi-pencil-square"></i>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="alert-icon">
                                                        <a href="#" class="delete-item" data-type="study_material" 
                                                            data-id="<?= $material["id"] ?>" title="Delete Material">
                                                            <i class="bi bi-trash"></i></a>
                                                    </div>
                                                </td>
                                            <?php endif; ?>
                                        </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="5" class="empty">No Materials Added!</td>
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
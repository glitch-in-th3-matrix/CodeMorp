<?php
    include_once "../Basic/Utils.php";

    $id = $_GET["id"] ?? null;
    $success = $_GET["success"] ?? null;
    $message = $success ? "Course $success!" : null;

    if ($id) {
        $qry_1 = "select * from courses where id = $id";
        $course = $connection->query($qry_1)->fetch_assoc();
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        extract(array_map("cleanInput", $_POST), EXTR_OVERWRITE);

        try {
            if (isset($_POST["add"])) {
                $qry_2 = "insert into courses values ('', '$name', '$course_code', 
                          '$description')";
                $success = "added";
            } else {
                $qry_2 = "update courses set name = '$name', course_code = '$course_code',
                          description = '$description' where id = $id";
                $success = "updated";
            }
            $connection->query($qry_2);
            
            header("Location: ./Courses.php?success=$success");
            exit;

        } catch (mysqli_sql_exception $e) {
            if ($e->getCode() === 1062) {
                $message = "This course is already added";
            } else {
                $message = $e->getMessage();
            }
        }
    }

    $qry_3 = "select * from courses";
    $courses = $connection->query($qry_3);

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

        <?php if (canManage("course")): ?>
            <div class="row mt-3">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-title">Add Course</div>
                            <hr>
                            <form method="post" class="row" enctype="multipart/form-data">
                                <div class="form-group col-lg-6">
                                    <label for="name">Name</label>
                                    <input type="text" name="name" class="form-control" 
                                        id="name" value="<?= $course["name"] ?? null ?>" required>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="course_code">Course Code</label>
                                    <input type="text" name="course_code" class="form-control" 
                                        id="course_code" value="<?= $course["course_code"] ?? null ?>" required>
                                </div>
                                <div class="form-group col-lg-12">
                                    <label for="description">Description</label>
                                    <textarea name="description" class="form-control" 
                                        id="description" required><?= $course["description"] ?? null ?></textarea>
                                </div>
                                <div class="form-group submit-box col-lg-12">
                                    <?php if ($id): ?>
                                        <input type="submit" name="update" class="btn btn-light px-5"
                                            value="Update Course">
                                    <?php else: ?>
                                        <input type="submit" name="add" class="btn btn-light px-5"
                                            value="Add Course">
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
                        <h5 class="mt-2">Courses</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table align-items-center table-hover table-borderless">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Course Code</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <?php if (canManage("course")): ?>
                                        <th></th>
                                        <th></th>
                                    <?php endif; ?>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($courses->num_rows): ?>
                                    <?php $count = 1; ?>
                                    <?php while ($course = $courses->fetch_assoc()): ?>
                                        <tr>
                                            <td><?= $count++ ?></td>
                                            <td><?= $course["course_code"] ?></td>
                                            <td><?= $course["name"] ?></td>
                                            <td><p><?= $course["description"] ?></p></td>
                                            <?php if (canManage("course")): ?>
                                                <td>
                                                    <div class="alert-icon">
                                                        <a href="./Courses.php?id=<?= $course["id"] ?>"
                                                            title="Edit Course">
                                                            <i class="bi bi-pencil-square"></i>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="alert-icon">
                                                        <a href="#" class="delete-item" data-type="course" 
                                                            data-id="<?= $course["id"] ?>" title="Delete Course">
                                                            <i class="bi bi-trash"></i></a>
                                                    </div>
                                                </td>
                                            <?php endif; ?>
                                        </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="4" class="empty">No Courses Added!</td>
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
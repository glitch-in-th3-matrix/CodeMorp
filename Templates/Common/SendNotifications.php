<?php
    include_once "../Basic/Utils.php";

    $success = isset($_GET["success"]);

    $qry_1 = $user_type == "regulator"  
             ? "select * from {$user_type}s where email = '$user_email'"
             : "select {$user_type}s.*, 
                concat(departments.course, ' ', departments.department) as department_name
                from {$user_type}s join departments on departments.id = {$user_type}s.department
                where {$user_type}s.email = '$user_email'";
    $user = $connection->query($qry_1)->fetch_assoc();

    $qry_2 = "select * from departments";
    $departments = $connection->query($qry_2);

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        extract(array_map("cleanInput", $_POST), EXTR_OVERWRITE);
        $attachment = $_FILES["attachment"];

        if ($_FILES['attachment']["error"] == UPLOAD_ERR_OK) {
            $attachment_location = "../../Media/Attachments";
            $attachment_extension = pathinfo($attachment["name"], PATHINFO_EXTENSION);
            $attachment_name = uniqid("", true). ".{$attachment_extension}";
            $attachment_path = "$attachment_location/$attachment_name";
            move_uploaded_file($attachment["tmp_name"], $attachment_path);
        } else {
            $attachment_name = "";
        }

        $qry_3 = "insert into notifications values ('', '$to', '{$user_type}s', '$user_email',
                  $department, '$title', '$attachment_name', '$message')";
        $connection->query($qry_3);

        header("Location: ./SendNotifications.php?success=true");
        exit;
    }

    include_once "../Basic/Head.php";
    include_once "../Basic/Menu.php";
?>

<div class="content-wrapper">
    <div class="container-fluid">

        <?php if ($success): ?>
            <div class="alert alert-danger alert-dismissible added" role="alert">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <div class="alert-icon">
                    <i class="icon-info"></i>
                </div>
                <div class="alert-message">
                    <span><strong>Notification Send!</strong></span>
                </div>
            </div>
        <?php endif; ?>

        <div class="row mt-3">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">Send Notification</div>
                        <hr>
                        <form method="post" class="row" enctype="multipart/form-data">
                            <div class="form-group col-lg-6">
                                <label for="to">To</label>
                                <select name="to" class="form-control" id="to" required>
                                    <?php if ($user_type == "regulator"): ?>
                                        <option value="all">Both</option>
                                        <option value="teachers">Teachers</option>
                                    <?php endif; ?>
                                    <option value="students">Students</option>
                                </select>
                            </div>
                            <div class="form-group col-lg-6">
                                <label for="department">Department</label>
                                <select name="department" class="form-control" id="department" required>
                                    <?php if ($user_type == "regulator"): ?>
                                        <option value="0">All Departments</option>
                                        <?php while ($department = $departments->fetch_assoc()): ?>
                                            <option value="<?= $department["id"] ?>">
                                                <?= "{$department["course"]} {$department["department"]}" ?>
                                            </option>
                                        <?php endwhile; ?>
                                    <?php else: ?>
                                        <option value="<?= $user["department"] ?>">
                                            <?= $user["department_name"] ?>
                                        </option>
                                    <?php endif; ?>
                                </select>
                            </div>
                            <div class="form-group col-lg-6">
                                <label for="title">Title</label>
                                <input type="text" name="title" class="form-control" id="title" required>
                            </div>
                            <div class="form-group col-lg-6">
                                <label for="attachment">Attachment</label>
                                <input type="file" name="attachment" class="form-control" 
                                    accept=".pdf, .doc, .docx, .zip" id="attachment">
                            </div>
                            <div class="form-group col-lg-12">
                                <label for="message">Message</label>
                                <textarea name="message" class="form-control" 
                                    id="message" required></textarea>
                            </div>
                            <div class="form-group submit-box col-lg-12">
                                <input type="submit" name="send" class="btn btn-light px-5"
                                    value="Send">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="overlay toggle-menu"></div>

    </div>
</div>

<?php
    include_once "../Basic/Footer.php"
?>
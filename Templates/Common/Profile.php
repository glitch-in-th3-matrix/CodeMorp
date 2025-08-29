<?php
    include_once "../Basic/Utils.php";
    
    $success = isset($_GET["success"]);
    $notices = isset($_GET["notices"]);

    $qry_1 = "select * from {$user_type}s where email = '{$user_email}'";
    $user = $connection->query($qry_1)->fetch_assoc();

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        extract(array_map("cleanInput", $_POST), EXTR_OVERWRITE);
        $photo = $_FILES["photo"];
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $photo_location = "../../Media/{$user_type}s";
        $photo_extension = pathinfo($photo["name"], PATHINFO_EXTENSION);
        $photo_name = uniqid("", true) . ".{$photo_extension}";
        $photo_path = "$photo_location/$photo_name";

        $qry_2 = $password
                 ? "update log_data set password = '$hashed_password' where email = '$user_email'"
                 : "select 1";
    
        $qry_3 = ($user_type == "regulator")
                 ? "update {$user_type}s set name = '$name', photo = '$photo_name', phone = '$phone',
                    dob = '$dob', address = '$address' where email = '$user_email'"
                 : "update {$user_type}s set name = '$name', photo = '$photo_name', phone = '$phone', 
                    department = '$department', address = '$address' where email = '$user_email'";

        $connection->query($qry_2);
        $connection->query($qry_3);

        @unlink("../../Media/{$user_type}s/{$user["photo"]}");
        move_uploaded_file($photo["tmp_name"], $photo_path);

        header("Location: ./Profile.php?success=true");
        exit;
    }

    if ($user_type != "regulator") {
        $qry_4 = "select * from departments";
        $departments = $connection->query($qry_4);

        $qry_5 = "select course, department from departments where id = {$user["department"]}";
        $user_department = $connection->query($qry_5)->fetch_assoc();

        $qry_6 = "select notifications.*, coalesce(regulators.name, teachers.name) as sender_name,
                  coalesce(regulators.photo, teachers.photo) as sender_photo from notifications 
                  left join regulators on notifications.sender = regulators.email
                  left join teachers on notifications.sender = teachers.email
                  where notifications.`to` in ('all', '{$user_type}s')
                  and notifications.department in (0, {$user['department']}) order by id desc";
        $notifications = $connection->query($qry_6);
    }

    include_once "../Basic/Head.php";
    include_once "../Basic/Menu.php";
?>

<div class="content-wrapper">
    <div class="container-fluid">

        <?php if ($success): ?>
            <div class="alert alert-danger alert-dismissible updated" role="alert">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <div class="alert-icon">
                    <i class="icon-info"></i>
                </div>
                <div class="alert-message">
                    <span><strong>Profile Updated!</strong></span>
                </div>
            </div>
        <?php endif; ?>

        <div class="row mt-3 profile-container">
            <div class="col-lg-4 profile-details">
                <div class="card profile-card-2">
                    <div class="card-img-block">
                        <img src="../../Media/<?= "{$user_type}s" ?>/<?= $user["photo"] ?>" 
                            class="img-fluid" alt="Card image cap">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title"><?= $user["name"] ?> </h5>
                        <h5 class="card-title"><span><?= $user["personnel_code"] ?></span></h5>
                        <table class="table table-borderless profile-info-table">
                            <tbody>
                                <tr>
                                    <td>Email</td>
                                    <td><?= $user["email"] ?></td>
                                </tr>
                                <tr>
                                    <td>Phone</td>
                                    <td><?= $user["phone"] ?></td>
                                </tr>
                                <tr>
                                    <?php if ($user_type == "regulator"): ?>
                                        <td>Date Of Birth</td>
                                        <td><?= date("F j, Y", strtotime($user["dob"])) ?></td>
                                    <?php else: ?>
                                        <td>Department</td>
                                        <td><?= "{$user_department["course"]} {$user_department["department"]}" ?></td>
                                    <?php endif; ?>
                                </tr>
                                <tr>
                                    <td>Address</td>
                                    <td>Ruby Nagar, West Fort, Kerala</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="icon-block">
                            <a href="javascript:void();"><i
                                    class="fa fa-facebook bg-facebook text-white"></i></a>
                            <a href="javascript:void();"> <i
                                    class="fa fa-twitter bg-twitter text-white"></i></a>
                            <a href="javascript:void();"> <i
                                    class="fa fa-google-plus bg-google-plus text-white"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-8 profile-tabs">
                <div class="card">
                    <div class="card-body">
                        <ul class="nav nav-tabs nav-tabs-primary row top-icon nav-justified">
                            <li class="nav-item">
                                <a href="javascript:void();" data-target="#edit" data-toggle="tab"
                                    class="nav-link <?= !$notices ? "active" : null ?>">
                                        <i class="icon-user-follow"></i> 
                                        <span class="hidden-xs">Edit</span>
                                </a>
                            </li>
                            <?php if ($user_type != "regulator"): ?>
                                <li class="nav-item">
                                    <a href="javascript:void();" data-target="#notifications" data-toggle="tab"
                                        class="nav-link <?= $notices ? "active" : null ?>">
                                            <i class="icon-bell"></i> 
                                            <span class="hidden-xs">Notifications</span></a>
                                </li>
                            <?php endif; ?>
                        </ul>
                        <div class="tab-content p-3">
                            <div class="tab-pane <?= !$notices ? "active" : null ?>" id="edit">
                                <form method="post" enctype="multipart/form-data">
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label"
                                            for="name">Name</label>
                                        <div class="col-lg-9">
                                            <input type="text" name="name" class="form-control"
                                                id="name" value="<?= $user["name"] ?>" required>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label"
                                            for="photo">Photo</label>
                                        <div class="col-lg-9">
                                            <input type="file" name="photo" class="form-control"
                                                id="photo" required>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label
                                            class="col-lg-3 col-form-label form-control-label"
                                                for="phone">Phone</label>
                                        <div class="col-lg-9">
                                            <input type="text" name="phone" class="form-control" 
                                                pattern="[6-9]\d{9}" id="phone" 
                                                value="<?= $user["phone"] ?>" required>
                                        </div>
                                    </div>
                                    <?php if ($user_type == "regulator"): ?>
                                        <div class="form-group row">
                                            <label
                                                class="col-lg-3 col-form-label form-control-label"
                                                    for="dob">Date Of Birth</label>
                                            <div class="col-lg-9">
                                                <input type="date" name="dob" class="form-control" 
                                                    id="dob" value="<?= $user["dob"] ?>" required>
                                            </div>
                                        </div>
                                    <?php else: ?>
                                        <div class="form-group row">
                                            <label
                                                class="col-lg-3 col-form-label form-control-label"
                                                    for="department">Department</label>
                                            <div class="col-lg-9">
                                                <select name="department" class="form-control" 
                                                    id="department" required>
                                                    <option value="">Choose Department</option>
                                                    <?php while ($department = $departments->fetch_assoc()): ?>
                                                        <option value="<?= $department["id"] ?>"
                                                            <?= $user["department"] == $department["id"]
                                                            ? "selected" : null ?>>
                                                            <?= "{$department["course"]} {$department["department"]}" ?>
                                                        </option>
                                                    <?php endwhile; ?>
                                                </select>
                                            </div>
                                        </div>
                                    <?php endif; ?>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label"
                                            for="email">Email</label>
                                        <div class="col-lg-9">
                                            <input type="email" name="email" class="form-control"
                                                id="email" value="<?= $user["email"] ?>" readonly   required>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label"
                                            for="password">Password</label>
                                        <div class="col-lg-9">
                                            <input type="password" name="password" class="form-control"
                                                id="password" placeholder="Password">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label"
                                            for="address">Address</label>
                                        <div class="col-lg-9">
                                            <textarea name="address" class="form-control" id="address"
                                                required><?= $user["address"] ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label"></label>
                                        <div class="col-lg-9">
                                            <input type="submit" name="update" class="btn btn-light px-5"
                                            value="Save Changes">
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <?php if ($user_type != "regulator"): ?>
                                <div class="tab-pane tab-pane-2 <?= $notices ? "active" : null ?>" 
                                    id="notifications">
                                    <div class="notifications">
                                        <?php if ($notifications->num_rows): ?>
                                            <?php while ($notification = $notifications->fetch_assoc()): ?>
                                                <div class="alert notification" data-title="<?= $notification["title"] ?>"
                                                    data-message="<?= $notification["message"] ?>"
                                                    data-attachment="<?= $notification["attachment"] ?>" role="alert">
                                                    <div class="alert-icon">
                                                        <i class="icon-info"></i>
                                                    </div>
                                                    <div class="img-wrap">
                                                        <img 
                                                            src="../../Media/<?= $notification["from"] ?>/<?= $notification["sender_photo"] ?>" 
                                                            alt="Sender Photo"
                                                        />
                                                    </div>
                                                    <p class="sender"><?= $notification["sender_name"] ?></p>
                                                    <p class="title"><?= $notification["title"] ?></p>
                                                </div>
                                            <?php endwhile; ?>
                                        <?php else: ?>
                                                <div class="alert empty">
                                                    <p>No Notifications !!</p>
                                                </div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>
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
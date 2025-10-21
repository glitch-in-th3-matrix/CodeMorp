<?php
    include_once "../Basic/Utils.php";

    $type = $_GET["type"] ?? null;
    $id = $_GET["id"] ?? null;
    $success = $_GET["success"] ?? null;
    $message = $success ? ucwords($type) . " $success!" : null;

    if ($id) {
        $qry_1 = "select * from {$type}s where id = $id";
        $person = $connection->query($qry_1)->fetch_assoc();
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        extract(array_map("cleanInput", $_POST), EXTR_OVERWRITE);
        $photo = $_FILES["photo"];
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $photo_location = "../../Media/{$type}s";
        $photo_extension = pathinfo($photo["name"], PATHINFO_EXTENSION);
        $photo_name = uniqid("", true) . ".{$photo_extension}";
        $photo_path = "$photo_location/$photo_name";

        $qry_2 = "select id from {$type}s order by id desc limit 1";
        $result = $connection->query($qry_2);
        $last_id = ($row = $result->fetch_assoc()) ? $row["id"] : 0;
        $personnel_code = 'CM-' . str_pad($last_id + 1, 2, '0', STR_PAD_LEFT) . ucwords($type[0]);

        try {
            if (isset($_POST["add"])) {
                $qry_3 = "insert into log_data values ('', '$email', '$hashed_password', '$type', 1)";
                
                $qry_4 = ($type == "regulator")
                         ? "insert into {$type}s values ('', '$personnel_code', '$name', '$photo_name', 
                           '$phone','$dob', '$email', '$address')"
                         : "insert into {$type}s values ('', '$personnel_code', '$name', '$photo_name', 
                           '$phone', '$department', '$email', '$address')";

                $success = "added";
            } else {
                $qry_3 = $password 
                         ? "update log_data set password = '$hashed_password' where email = '$email'"
                         : "select 1";

                $qry_4 = ($type === "regulator")
                         ? "update {$type}s set name = '$name', photo = '$photo_name', phone = '$phone', 
                            dob = '$dob', address = '$address' where id = $id"
                         : "update {$type}s set name = '$name', photo = '$photo_name', phone = '$phone', 
                            department = '$department', address = '$address' where id=$id";
                         
                $success = "updated";
            }
            $connection->query($qry_3);
            $connection->query($qry_4);

            @unlink("../../Media/{$type}s/{$person['photo']}");
            move_uploaded_file($photo["tmp_name"], $photo_path);

            header("Location: ./Personnel.php?type=$type&success=$success");
            exit;

        } catch (mysqli_sql_exception $e) {
            if ($e->getCode() === 1062) {
                unset($success);
                $message = "This email is already registered!";
            } else {
                $message = $e->getMessage();
            }
        }
    }

    if (canManage($type) && ($type != "regulator")) {
        $qry_5 = "select * from departments";
        $departments = $connection->query($qry_5);
        
        $qry_6 = "select * from courses";
        $courses = $connection->query($qry_6);
    }

    $qry_7 = (in_array($user_type, ["admin", "regulator"])) 
             ? "select * from {$type}s order by id desc"
             : "select * from {$type}s where department = (
                select department from {$user_type}s where
                email = '$user_email') order by id desc";
    $personnel = $connection->query($qry_7);

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

        <?php if (canManage($type)): ?>
            <div class="row mt-3">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-title"><?= $id ? "Update" : "Add" ?> <?= $type ?></div>
                            <hr>
                            <form method="post" class="row" enctype="multipart/form-data">
                                <div class="form-group col-lg-6">
                                    <label for="name">Name</label>
                                    <input type="text" name="name" class="form-control" 
                                        id="name" value="<?= $person["name"] ?? null ?>" required>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="photo">Photo</label>
                                    <input type="file" name="photo" class="form-control" 
                                        id="photo" accept="image/*" required>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="phone">Phone</label>
                                    <input type="text" name="phone" class="form-control"
                                        id="phone" value="<?= $person["phone"] ?? null ?>" 
                                        pattern="[6-9]\d{9}" required>
                                </div>
                                <?php if ($type == "regulator"): ?>
                                    <div class="form-group col-lg-6">
                                        <label for="dob">Date Of Birth</label>
                                        <input type="date" name="dob" class="form-control" 
                                            id="dob" value="<?= $person["dob"] ?? null ?>" required>
                                    </div>
                                <?php else: ?>
                                    <div class="form-group col-lg-6">
                                        <label for="department">Department</label>
                                        <select name="department" id="department" class="form-control"
                                            required>
                                            <option value="">Choose Department</option>
                                            <?php while ($department = $departments->fetch_assoc()): ?>
                                                <option value="<?= $department["id"] ?>"
                                                    <?= ($person["department"] ?? null) == $department["id"] 
                                                    ? 'selected' : null ?>>
                                                    <?= "{$department["course"]} {$department["department"]}" ?></option>
                                            <?php endwhile; ?>
                                        </select>
                                    </div>
                                <?php endif; ?>
                                <div class="form-group col-lg-6">
                                    <label for="email">Email</label>
                                    <input type="email" name="email" class="form-control" 
                                        id="email" value="<?= $person["email"] ?? null ?>" 
                                        <?= ($person ?? null) ? 'readonly' : null ?> required>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="password">Password</label>
                                    <input type="password" name="password" class="form-control"  id="password" 
                                    <?= ($person ?? null) ? 'placeholder="Password"' : 'required' ?>>
                                </div>
                                <div class="form-group col-lg-12">
                                    <label for="address">Address</label>
                                    <textarea name="address" class="form-control" 
                                        id="address" required><?= $person["address"] ?? null ?></textarea>
                                </div>
                                <div class="form-group submit-box col-lg-12">
                                    <?php if ($id): ?>
                                        <input type="submit" name="update" class="btn btn-light px-5"
                                            value="Update <?= $type ?>">
                                    <?php else: ?>
                                        <input type="submit" name="add" class="btn btn-light px-5"
                                            value="Add <?= $type ?>">
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
                        <h5 class="mt-2"><?= strtoupper($type) . "S" ?></h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table align-items-center table-hover table-borderless">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <?php if (canManage($type)): ?>
                                        <th></th>
                                        <th></th>
                                    <?php endif; ?>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($personnel->num_rows): ?>
                                    <?php while ($person = $personnel->fetch_assoc()): ?>
                                        <tr 
                                            <?php if($type == "student"): ?>
                                                data-student-id="<?= $person["id"] ?>"
                                            <?php endif; ?>>
                                            <td><?= $person["personnel_code"] ?></td>
                                            <td>
                                                <div class="img-wrap">
                                                    <img src="../../Media/<?= $type ?>s/<?= $person["photo"] ?>" 
                                                        class="product-img" alt="Profile Pic">
                                                </div>
                                            </td>
                                            <td><?= $person["name"] ?></td>
                                            <td><?= $person["phone"] ?></td>
                                            <td><?= $person["email"] ?></td>
                                            <td><?= $person["address"] ?></td>
                                            <?php if (canManage($type)): ?>
                                                <td>
                                                    <div class="alert-icon">
                                                        <a href="./Personnel.php?type=<?= $type ?>&id=<?= $person["id"] ?>"
                                                            title="Edit <?= ucwords($type) ?>">
                                                            <i class="bi bi-pencil-square"></i></a>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="alert-icon">
                                                        <a href="#" class="delete-item" data-type="<?= $type ?>"
                                                            data-id="<?= $person["id"] ?>" 
                                                            title="Delete <?= ucwords($type) ?>">
                                                            <i class="bi bi-trash"></i></a>
                                                    </div>
                                                </td>
                                            <?php endif; ?>
                                        </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="9" class="empty">No <?= $type ?>s to show!</td>
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
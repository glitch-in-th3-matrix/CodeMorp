<?php
    include_once "../Basic/Utils.php";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $email = cleanInput($_POST["email"]);
        $password = cleanInput($_POST["password"]);

        $qry_1 = "select * from log_data where email = '$email'";
        $data = $connection->query($qry_1);

        if ($data->num_rows) {
            $user = $data->fetch_assoc();

            if (password_verify($password, $user["password"])) {
                $_SESSION["user_email"] = $email;
                $_SESSION["user_type"] = $user["user_type"];
                header("Location: ./Index.php");
                exit;
            }
        }

        $invalid = true;
    }

    include_once "../Basic/Head.php";
?>

<?php if ($invalid ?? null): ?>
    <div id="flash-message" data-message="Invalid Email or Password"></div>
<?php endif ?>

<div id="wrapper">
    <div class="loader-wrapper">
        <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <div class="card card-authentication1 login-card mx-auto my-5">
        <div class="card-body">
            <div class="card-content p-2">
                <div class="logo-wrap">
                    <img src="../../Assets/images/logo-icon.png" alt="logo icon">
                </div>
                <div class="card-title text-uppercase text-center py-3">Login</div>
                <form method="post">
                    <div class="form-group">
                        <label for="exampleInputUsername" class="sr-only">Email</label>
                        <div class="position-relative has-icon-right">
                            <input type="email" name="email" class="form-control input-shadow" 
                                id="exampleInputUsername" placeholder="Email"
                                value="<?= $email ?? null ?>" required>
                            <div class="form-control-position">
                                <i class="icon-user"></i>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword" class="sr-only">Password</label>
                        <div class="position-relative has-icon-right">
                            <input type="password" name="password" class="form-control input-shadow"
                                id="password-input" placeholder="Password" 
                                value="<?= $password ?? null ?>" required>
                            <div class="form-control-position">
                                <i class="icon-lock"></i>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-6">
                            <div class="icheck-material-white">
                                <input type="checkbox" id="show-password"/>
                                <label for="show-password">Show Password</label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-light btn-block">Sign In</button>
                    <div class="text-center mt-3">Sign In With</div>

                    <div class="form-row mt-4">
                        <div class="form-group mb-0 col-6">
                            <button type="button" class="btn btn-light btn-block"><i
                                    class="fa fa-facebook-square"></i> Facebook</button>
                        </div>
                        <div class="form-group mb-0 col-6 text-right">
                            <button type="button" class="btn btn-light btn-block"><i
                                    class="fa fa-twitter-square"></i> Twitter</button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
        <div class="card-footer text-center py-3">
            <p class="text-warning mb-0">Do not have an account? <a href="./Register.php"> Sign Up here</a></p>
        </div>
    </div>
</div>

<script src="../../Assets/js/jquery.min.js"></script>
<script src="../../Assets/js/sweetalert2.all.min.js"></script>
<script src="../../Assets/js/CodeMorph.js"></script>
<?php 
    include_once "../Basic/Utils.php";

    if ($user_type) {
        $qry = ($user_type == "admin")
               ? "select 1"
               : "select name, photo from {$user_type}s where email = '{$_SESSION["user_email"]}'";
        $account = $connection->query($qry)->fetch_assoc();
    }
?>

<div id="wrapper">
    <div id="sidebar-wrapper" data-simplebar="" data-simplebar-auto-hide="true">
        <div class="brand-logo">
            <a href="index.html">
                <img src="../../Assets/images/logo-icon.png" class="logo-icon" alt="logo icon">
                <h5 class="logo-text">CodeMorph</h5>
            </a>
        </div>
        <ul class="sidebar-menu do-nicescrol">
            <li class="sidebar-header">MAIN NAVIGATION</li>
            <li>
                <a href="../Common/Index.php">
                    <i class="zmdi zmdi-home"></i> 
                    <span>Home</span>
                </a>
            </li>
            <?php if ($user_type): ?>
                <?php if ($user_type == "admin"): ?>
                    <li>
                        <a href="../Common/Personnel.php?type=regulator">
                            <i class="zmdi zmdi-accounts-list-alt"></i> 
                            <span>Regulators</span>
                        </a>
                    </li>
                <?php elseif ($user_type == "regulator"): ?>
                    <li>
                        <a href="../Common/Courses.php">
                            <i class="zmdi zmdi-collection-bookmark"></i> 
                            <span>Courses</span>
                        </a>
                    </li>
                    <li>
                        <a href="../Common/Departments.php">
                            <i class="zmdi zmdi-city-alt"></i> 
                            <span>Departments</span>
                        </a>
                    </li>
                    <li>
                        <a href="../Common/Personnel.php?type=teacher">
                            <i class="zmdi zmdi-accounts-outline"></i> 
                            <span>Teachers</span>
                        </a>
                    </li>
                    <li>
                        <a href="../Common/Personnel.php?type=student">
                            <i class="zmdi zmdi-graduation-cap"></i> 
                            <span>Students</span>
                        </a>
                    </li>
                <?php elseif ($user_type == "teacher"): ?>
                    <li>
                        <a href="../Common/Personnel.php?type=student">
                            <i class="zmdi zmdi-graduation-cap"></i> 
                            <span>Students</span>
                        </a>
                    </li>
                    <li>
                        <a href="../Common/StudyMaterials.php">
                            <i class="zmdi zmdi-collection-text"></i> 
                            <span>Study Materials</span>
                        </a>
                    </li>
                    <li>
                        <a href="../Common/TestQuestions.php">
                            <i class="zmdi zmdi-assignment"></i> 
                            <span>Test Questions</span>
                        </a>
                    </li>
                    <li>
                        <a href="../Common/Simulations.php">
                            <i class="zmdi zmdi-lamp"></i> 
                            <span>Learning Canvas</span>
                        </a>
                    </li>
                <?php endif; ?>
                <li>
                    <a href="../Common/Logout.php">
                        <i class="zmdi zmdi-lock"></i> 
                        <span>Logout</span>
                    </a>
                </li>
            <?php else: ?>
                <li>
                    <a href="../Common/Login.php">
                        <i class="zmdi zmdi-lock-open"></i> 
                        <span>Login</span>
                    </a>
                </li>
                <li>
                    <a href="../Common/Register.php">
                        <i class="zmdi zmdi-account-circle"></i> 
                        <span>Register</span>
                    </a>
                </li>
            <?php endif; ?>
        </ul>
    </div>

    <header class="topbar-nav">
        <nav class="navbar navbar-expand fixed-top">
            <ul class="navbar-nav mr-auto align-items-center">
                <li class="nav-item">
                    <a class="nav-link toggle-menu" href="javascript:void();">
                        <i class="icon-menu menu-icon"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <form class="search-bar">
                        <input type="text" class="form-control" placeholder="Enter keywords">
                        <a href="javascript:void();"><i class="icon-magnifier"></i></a>
                    </form>
                </li>
            </ul>

            <ul class="navbar-nav align-items-center right-nav-link  <?= $user_type ? null : 'd-none' ?>">
                <li class="nav-item dropdown-lg">
                    <a class="nav-link dropdown-toggle dropdown-toggle-nocaret waves-effect" 
                        data-toggle="dropdown" href="javascript:void();">
                        <i class="fa fa-envelope-open-o"></i></a>
                </li>
                <li class="nav-item dropdown-lg">
                    <a class="nav-link dropdown-toggle dropdown-toggle-nocaret waves-effect" 
                        data-toggle="dropdown" href="javascript:void();">
                        <i class="fa fa-bell-o"></i></a>
                </li>
                <li class="nav-item language">
                    <a class="nav-link dropdown-toggle dropdown-toggle-nocaret waves-effect" 
                        data-toggle="dropdown" href="javascript:void();">
                        <i class="fa fa-flag"></i></a>
                    <ul class="dropdown-menu dropdown-menu-right">
                        <li class="dropdown-item"> <i class="flag-icon flag-icon-gb mr-2"></i> English</li>
                        <li class="dropdown-item"> <i class="flag-icon flag-icon-fr mr-2"></i> French</li>
                        <li class="dropdown-item"> <i class="flag-icon flag-icon-cn mr-2"></i> Chinese</li>
                        <li class="dropdown-item"> <i class="flag-icon flag-icon-de mr-2"></i> German</li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link dropdown-toggle dropdown-toggle-nocaret" data-toggle="dropdown" href="#">
                        <div class="user-profile">
                            <img src="../../Media/<?= "{$user_type}s" ?>/<?= $account["photo"] ?? "admin.jpg" ?>" 
                                class="img-circle" alt="user avatar">
                        </div>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-right" id="account-dropdown">
                        <li class="dropdown-item user-details">
                            <a href="javaScript:void();">
                                <div class="media">
                                    <div class="avatar">
                                        <img class="align-self-start mr-3" 
                                            src="../../Media/<?= "{$user_type}s" ?>/<?= $account["photo"] ?? "admin.jpg" ?>" 
                                            alt="user avatar">
                                    </div>
                                    <div class="media-body">
                                        <h6 class="mt-2 user-title"><?= $account["name"] ?? "Admin" ?></h6>
                                        <p class="user-subtitle"><?= $user_email ?? null ?></p>
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li class="dropdown-divider"></li>
                        <?php if ($user_type != "admin"): ?>
                            <a href="../Common/Profile.php" class="dropdown-item">
                                <i class="icon-user mr-2"></i> Profile
                        <?php endif; ?>
                        <a href="../Common/Logout.php" class="dropdown-item">
                            <i class="icon-power mr-2"></i> Logout
                        </a>
                    </ul>
                </li>
            </ul>
        </nav>
    </header>

    <div class="clearfix"></div>
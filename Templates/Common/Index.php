<?php
    include_once "../Basic/Utils.php";

    $qry_1 = "select
              count(case when user_type = 'teacher' then 1 end) as teachers,
              count(case when user_type = 'student' then 1 end) as students
              from log_data";
    [$teachers, $students] = array_values($connection->query($qry_1)->fetch_assoc());
    
    $qry_2 = "select count(*) as departments from departments";
    $departments = $connection->query($qry_2)->fetch_assoc()["departments"];

    $qry_3 = "select count(*) as visualizations from simulations";
    $visualizations = $connection->query($qry_3)->fetch_assoc()["visualizations"];
        
    include_once "../Basic/Head.php";
    include_once "../Basic/Menu.php";
?>

<div class="content-wrapper">
    <div class="container-fluid index-container">
        <div class="card site-stats mt-3">
            <div class="card-content">
                <div class="row row-group m-0">
                    <div class="col-12 col-lg-6 col-xl-3 border-light stat">
                        <div class="card-body">
                            <h5 class="text-white mb-0">
                                <span class="zmdi zmdi-accounts"></span>
                            </h5>
                            <div class="progress my-3" style="height:3px;">
                                <div class="progress-bar" style="width:100%"></div>
                            </div>
                            <p class="mb-0 text-white"><?= $teachers ?> Teachers</p>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 col-xl-3 border-light stat">
                        <div class="card-body">
                            <h5 class="text-white mb-0">
                                <span class="zmdi zmdi-graduation-cap"></span>
                            </h5>
                            <div class="progress my-3" style="height:3px;">
                                <div class="progress-bar" style="width:100%"></div>
                            </div>
                            <p class="mb-0 text-white"><?= $students ?> Students</p>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 col-xl-3 border-light stat">
                        <div class="card-body">
                            <h5 class="text-white mb-0">
                                <span class="zmdi zmdi-city-alt"></span>
                            </h5>
                            <div class="progress my-3" style="height:3px;">
                                <div class="progress-bar" style="width:100%"></div>
                            </div>
                            <p class="mb-0 text-white"><?= $departments ?> Departments</p>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 col-xl-3 border-light stat">
                        <div class="card-body">
                            <h5 class="text-white mb-0">
                                <span class="zmdi zmdi-lamp"></span>
                            </h5>
                            <div class="progress my-3" style="height:3px;">
                                <div class="progress-bar" style="width:100%"></div>
                            </div>
                            <p class="mb-0 text-white"><?= $visualizations ?> Visualizations</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-lg-12">
                <div class="card index-card">
                    <p>Coding Simplified</p>
                </div>
            </div>
        </div>
        <div class="overlay toggle-menu"></div>
    </div>
</div>

<?php
    include_once "../Basic/Footer.php";
?>
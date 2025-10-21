<?php
    include_once "../Basic/Utils.php";

    $id = $_GET["id"];

    $qry_1 = "select students.*, departments.department, departments.course
              from students join departments on students.department = departments.id
              where students.id = $id";
    $student = $connection->query($qry_1)->fetch_assoc();

    $qry_2 = "select score from tests where student = '{$student["email"]}'";
    $scores = array_column(
        $connection->query($qry_2)->fetch_all(MYSQLI_ASSOC),
        "score"
    );
    
    $marks = json_encode($scores);    

    include_once "../Basic/Head.php";
    include_once "../Basic/Menu.php";
?>

<div class="content-wrapper">
    <div class="container-fluid">
        <div class="row mt-3 profile-container">
            <div class="col-lg-4 profile-details">
                <div class="card profile-card-2">
                    <div class="card-img-block">
                        <img src="../../Media/students/<?= $student["photo"] ?>"
                            class="img-fluid" alt="Card image cap">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title"><?= $student["name"] ?> </h5>
                        <h5 class="card-title"><span><?= $student["personnel_code"] ?></span></h5>
                        <table class="table table-borderless profile-info-table">
                            <tbody>
                                <tr>
                                    <td>Email</td>
                                    <td><?= $student["email"] ?></td>
                                </tr>
                                <tr>
                                    <td>Phone</td>
                                    <td><?= $student["phone"] ?></td>
                                </tr>
                                <tr>
                                    <td>Department</td>
                                    <td><?= "{$student["course"]} {$student["department"]}" ?></td>
                                </tr>
                                <tr>
                                    <td>Address</td>
                                    <td><?= $student["address"] ?></td>
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
        
            <div class="col-12 col-lg-8 col-xl-8 exam-chart-wrapper">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Exam Evaluation</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-inline">
                            <li class="list-inline-item"><i class="fa fa-circle mr-2 text-white"></i>Test Score</li>
                        </ul>
                        <div class="chart-container-1">
                            <canvas id="tests-chart" 
                                data-marks="<?= htmlspecialchars($marks, ENT_QUOTES) ?>">
                            </canvas>
                        </div>
                    </div>

                    <div class="row m-0 row-group text-center border-top border-light-3">
                        <div class="col-12 col-lg-4">
                            <div class="p-3">
                                <h5 class="mb-0"><?= count($scores) ?></h5>
                                <small class="mb-0">Tests Taken<span></small>
                            </div>
                        </div>
                        <div class="col-12 col-lg-4">
                            <div class="p-3">
                                <h5 class="mb-0">
                                    <?= !empty($scores) ? array_sum($scores) / count($scores) : 0 ?>
                                </h5>
                                <small class="mb-0">Avg Marks</small>
                            </div>
                        </div>
                        <div class="col-12 col-lg-4">
                            <div class="p-3">
                                <h5 class="mb-0"><?= !empty($scores) ? max($scores) : 0 ?></h5>
                                <small class="mb-0">Top Mark</span></small>
                            </div>
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
<?php
    include_once "../Basic/Utils.php";

    $id = $_GET["id"] ?? null;
    $success = $_GET["success"] ?? null;
    $message = $success ? "Department $success!" : null;

    if ($id) {
        $qry_1 = "select * from departments where id = $id";
        $department = $connection->query($qry_1)->fetch_assoc();
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        extract(array_map("cleanInput", $_POST), EXTR_OVERWRITE);

        try {
            if (isset($_POST["add"])) {
                $qry_2 = "insert into departments values ('', '$department', '$course', 
                          '$email', '$fees')";
                $success = "added";
            } else {
                $qry_2 = "update departments set department = '$department', course = '$course',
                          email = '$email', fees = $fees where id ='$id'";
                $success = "updated";
            }
            $connection->query($qry_2);

            header("Location: ./Departments.php?success=$success");
            exit;

        } catch (mysqli_sql_exception $e) {
            if ($e->getCode() === 1062) {
                unset($success);
                $message = "Integrity constraint broken";
                $message = $e->getMessage();
            }
        }
    }

    if (canManage("course")) {
        $qry_3 = "select * from courses";
        $courses = $connection->query($qry_3);
    }

    $qry_4 = "select departments.*, 
              concat(departments.course, ' ', departments.department) as name,
              count(students.id) as student_count, 
              (departments.fees * count(students.id)) as revenue
              from departments left join students on departments.id = students.department
              group by departments.id";
    $departments = $connection->query($qry_4)->fetch_all(MYSQLI_ASSOC);

    $top_departments = array_slice(
        (function(array $array): array {
            $copy = $array;
            usort($copy, fn($a, $b) => $b["student_count"] <=> $a["student_count"]);
            return $copy;
        }) ($departments),
        0, 3
    );
    
    $total_revenue = array_sum(array_map(
        fn($department) => $department["fees"] * $department["student_count"], 
        $departments
    ));

    $qry_5 = "select (select count(*) from departments) as departments,
              (select count(*) from students) as students";
    $total_count = $connection->query($qry_5)->fetch_assoc();

    $department_names = json_encode(array_column($departments, 'name'));
    $revenue = json_encode(array_column($departments, 'revenue'));
    $student_count = json_encode(array_column($departments, 'student_count'));

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

        <?php if (canManage("department")): ?>
            <div class="row mt-3">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-title">Add Department</div>
                            <hr>
                            <form method="post" class="row" enctype="multipart/form-data">
                                <div class="form-group col-lg-6">
                                    <label for="department">Department</label>
                                    <input type="text" name="department" class="form-control" 
                                        id="department" value="<?= $department["department"] ?? null ?>" required>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="course">Course</label>
                                    <select name="course" id="course" class="form-control" required>
                                        <option value="">Choose Course</option>
                                        <?php while ($course = $courses->fetch_assoc()): ?>
                                            <option value="<?= $course["course_code"] ?>"
                                                <?= ($department["course"] ?? null) == $course["course_code"] 
                                                ? 'selected' : null ?>><?= $course["name"] ?></option>
                                        <?php endwhile; ?>
                                    </select>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="email">Email</label>
                                    <input type="email" name="email" class="form-control" 
                                        id="email" value="<?= $department["email"] ?? null ?>" required>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="fees">Fees</label>
                                    <input type="number" name="fees" class="form-control" 
                                        id="fees" value="<?= $department["fees"] ?? null ?>" required>
                                </div>
                                <div class="form-group submit-box col-lg-12">
                                    <?php if ($id): ?>
                                        <input type="submit" name="update" class="btn btn-light px-5"
                                            value="Update Department">
                                    <?php else: ?>
                                        <input type="submit" name="add" class="btn btn-light px-5"
                                            value="Add Department">
                                    <?php endif; ?>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <div class="row" id="charts-container">
            <div class="col-12 col-lg-8 col-xl-8 left">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Revenue</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-inline">
                            <li class="list-inline-item"><i class="fa fa-circle mr-2 text-white"></i>Revenue in ₹</li>
                        </ul>
                        <div class="chart-container-1">
                            <canvas id="revenue-chart" 
                                data-departments="<?= htmlspecialchars($department_names, ENT_QUOTES) ?>"
                                data-revenue="<?= htmlspecialchars($revenue, ENT_QUOTES) ?>">
                            </canvas>
                        </div>
                    </div>

                    <div class="row m-0 row-group text-center border-top border-light-3">
                        <div class="col-12 col-lg-4">
                            <div class="p-3">
                                <h5 class="mb-0"><?= $total_count["departments"] ?></h5>
                                <small class="mb-0">Departments<span></small>
                            </div>
                        </div>
                        <div class="col-12 col-lg-4">
                            <div class="p-3">
                                <h5 class="mb-0"><?= $total_count["students"] ?></h5>
                                <small class="mb-0">Students</small>
                            </div>
                        </div>
                        <div class="col-12 col-lg-4">
                            <div class="p-3">
                                <h5 class="mb-0">₹ <?= $total_revenue ?></h5>
                                <small class="mb-0">Total Revenue</span></small>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="col-12 col-lg-4 col-xl-4 right">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Students</h5>
                    </div>
                    <div class="card-body">
                        <div class="chart-container-2">
                            <canvas id="departments-chart"
                                data-departments="<?= htmlspecialchars($department_names, ENT_QUOTES) ?>"
                                data-student-count="<?= htmlspecialchars($student_count, ENT_QUOTES) ?>"></canvas>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table align-items-center">
                            <tbody>
                                <tr>
                                    <td colspan=3>
                                        <h5 class="mb-0">Top Departments</h5>
                                    </td>
                                </tr>
                                <?php foreach ($top_departments as $department): ?>
                                    <tr>
                                        <td><i class="fa fa-circle text-white mr-2"></i><?= "{$department["course"]} {$department["department"]}" ?></td>
                                        <td><?= $department["student_count"] * 100 / $total_count["students"]  ?>%</td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12 col-lg-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mt-2">Departments</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table align-items-center table-hover table-borderless">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Course</th>
                                    <th>Contact Email</th>
                                    <th>Fees</th>
                                    <?php if (canManage("department")): ?>
                                        <th></th>
                                        <th></th>
                                    <?php endif; ?>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($departments): ?>
                                    <?php foreach ($departments as $index => $department): ?>
                                        <tr>
                                            <td><?= $index + 1 ?></td>
                                            <td><?= $department["department"] ?></td>
                                            <td><?= $department["course"] ?></td>
                                            <td><?= $department["email"] ?></td>
                                            <td>₹ <?= $department["fees"] ?></td>
                                            <?php if (canManage("department")): ?>
                                                <td>
                                                    <div class="alert-icon">
                                                        <a href="./Departments.php?id=<?= $department["id"] ?>"
                                                            title="Edit Course">
                                                            <i class="bi bi-pencil-square"></i>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="alert-icon">
                                                        <a href="#" class="delete-item" data-type="course" 
                                                            data-id="<?= $department["id"] ?>" title="Delete Course">
                                                            <i class="bi bi-trash"></i></a>
                                                    </div>
                                                </td>
                                            <?php endif; ?>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="7" class="empty">No Departments Added!</td>
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
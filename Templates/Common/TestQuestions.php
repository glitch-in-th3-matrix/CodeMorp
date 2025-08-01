<?php
    include_once "../Basic/Utils.php";

    $id = $_GET["id"] ?? null;
    $success = $_GET["success"] ?? null;
    $message = $success ? "Question $success!" : null;

    if ($id) {
        $qry_1 = "select * from test_questions where id = $id";
        $test_question = $connection->query($qry_1)->fetch_assoc();
    }
    
    $qry_2 = "select department from {$user_type}s where email = '$user_email'";
    $user_department = $connection->query($qry_2)->fetch_assoc()["department"];

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        extract(array_map("cleanInput", $_POST), EXTR_OVERWRITE);

        try {
            if (isset($_POST["add"])) {
                $qry_3 = "insert into test_questions values ('', '$question', '$answer',
                          '$option_1', '$option_2', '$option_3', '$user_department', '$user_email')";
                $success = "added";
            } else {
                $qry_3 = "update test_questions set question = '$question', answer = '$answer', 
                          option_1 = '$option_1', option_2 = '$option_2', option_3 = '$option_3'
                          where id = $id";
                $success = "updated";
            }
            $connection->query($qry_3);

            header("Location: ./TestQuestions.php?success=$success");
            exit;

        } catch (mysqli_sql_exception $e) {
            if ($e->getCode() === 1062) {
                unset($success);
                $message = "This question is already added!";
            }
        }
    }

    $qry_4 = ($user_type == "teacher")
             ? "select * from test_questions where added_by = '$user_email'
                order by id desc"
             : "select * from test_questions where department = $user_department
                order by id desc";
    $test_questions = $connection->query($qry_4);

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

        <?php if (canManage("test_question")): ?>
            <div class="row mt-3">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-title">Add Test Question</div>
                            <hr>
                            <form method="post" class="row" enctype="multipart/form-data">
                                <div class="form-group col-lg-12">
                                    <label for="question">Question</label>
                                    <textarea name="question" class="form-control" 
                                        id="question" required><?= $test_question["question"] ?? null ?></textarea>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="answer">Answer</label>
                                    <input type="text" name="answer" class="form-control" 
                                        id="answer" value="<?= $test_question["answer"] ?? null ?>" required>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="option_1">Option 1</label>
                                    <input type="text" name="option_1" class="form-control" 
                                        id="option_1" value="<?= $test_question["option_1"] ?? null ?>" required>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="option_2">Option 2</label>
                                    <input type="text" name="option_2" class="form-control" 
                                        id="option_2" value="<?= $test_question["option_2"] ?? null ?>" required>
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="option_3">Option 3</label>
                                    <input type="text" name="option_3" class="form-control" 
                                        id="option_3" value="<?= $test_question["option_3"] ?? null ?>" required>
                                </div>
                                <div class="form-group submit-box col-lg-12">
                                    <?php if ($id): ?>
                                        <input type="submit" name="update" class="btn btn-light px-5"
                                            value="Update Question">
                                    <?php else: ?>
                                        <input type="submit" name="add" class="btn btn-light px-5"
                                            value="Add Question">
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
                        <h5 class="mt-2">Test Questions</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table align-items-center table-hover table-borderless">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Question</th>
                                    <th>Answer</th>
                                    <?php if (canManage("test_question")): ?>
                                        <th></th>
                                        <th></th>
                                    <?php endif; ?>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($test_questions->num_rows): ?>
                                    <?php $count = 1; ?>
                                    <?php while ($question = $test_questions->fetch_assoc()): ?>
                                        <tr>
                                            <td><?= $count++ ?></td>
                                            <td class="question">
                                                <p><?= $question["question"] ?></p>
                                            </td>
                                            <td class="answer">
                                                <p><?= $question["answer"] ?></p>
                                            </td>
                                            <?php if (canManage("study_material")): ?>
                                                <td>
                                                    <div class="alert-icon">
                                                        <a href="./TestQuestions.php?id=<?= $question["id"] ?>"
                                                            title="Edit Material">
                                                            <i class="bi bi-pencil-square"></i>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="alert-icon">
                                                        <a href="#" class="delete-item" data-type="test_question" 
                                                            data-id="<?= $question["id"] ?>" title="Delete Question">
                                                            <i class="bi bi-trash"></i></a>
                                                    </div>
                                                </td>
                                            <?php endif; ?>
                                        </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="5" class="empty">No Questions Added!</td>
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
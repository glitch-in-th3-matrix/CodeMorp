<?php
    include_once "../Basic/Utils.php";

    $qry_1 = "select department from students where email = '$user_email'";
    $department = $connection->query($qry_1)->fetch_row()[0];

    $qry_2 = "select * from test_questions where department = $department 
              order by rand() limit 20";
    $questions = $connection->query($qry_2)->fetch_all(MYSQLI_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($questions);
?>
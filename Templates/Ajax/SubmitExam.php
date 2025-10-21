<?php
    include_once "../Basic/Utils.php";

    $response = [
        "status" => "error",
        "message" => "unknown error"
    ];

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $score = cleanInput($_POST["score"]);

        $qry_1 = "insert into tests values (null, '$user_email', '$score', curdate())";
        $connection->query($qry_1);

        $response["status"] = "success";
        $response["message"] = "Exam Submitted!";
    } else {
        $response["message"] = "Invalid Request";
    }

    echo json_encode($response);
?>
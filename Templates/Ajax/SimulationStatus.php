<?php
    include_once "../Basic/Utils.php";

    $response = [
        "status" => "error",
        "message" => "unknown error"
    ];

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $status = cleanInput($_POST["status"]);
        $id = cleanInput($_POST["id"]);

        $qry_1 = "update simulations set status = '$status' where id = '$id'";
        $connection->query($qry_1);

        $response["status"] = "success";
        $response["message"] = "Status updated successfully";
    } else {
        $response["message"] = "Invalid Request";
    }

    echo json_encode($response);
?>
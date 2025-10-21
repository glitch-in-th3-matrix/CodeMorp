<?php
    include_once "../Basic/Utils.php";

    $response = [
        "status" => false,
        "messages" => []
    ];

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $contact = cleanInput($_POST["contact"]);

        $qry_1 = "select * from messages where
                  (sender = '$contact' and receiver = '$user_email') or
                  (sender = '$user_email' and receiver = '$contact')";
                  
        $response["messages"] = $connection->query($qry_1)->fetch_all(MYSQLI_ASSOC);
        $response["status"] = "success";
    }

    echo json_encode($response);
?>
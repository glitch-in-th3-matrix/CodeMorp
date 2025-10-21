<?php
    include_once "../Basic/Utils.php";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $receiver = cleanInput($_POST["receiver"]);
        $message = cleanInput($_POST["message"]);

        $qry_1 = "insert into messages values 
                  (null, '$user_email', '$receiver', '$message', now())";
        $connection->query($qry_1);

        echo json_encode(["status" => "success"]);
    }
?>
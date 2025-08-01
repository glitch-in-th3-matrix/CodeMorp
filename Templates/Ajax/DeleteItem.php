<?php
    include_once "../Basic/Utils.php";

    $response = [
        "status" => "error",
        "message" => "Unknown error"
    ];

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $type = cleanInput($_POST["type"]);
        $id = cleanInput($_POST["id"]);

        $personnel = [
            "regulator", 
            "teacher", 
            "student"
        ];
        $is_account = in_array($type, $personnel);

        if ($is_account) {
            $qry_1 = "select email, photo from {$type}s where id = $id";
            $user = $connection->query($qry_1)->fetch_assoc();
    
            @unlink("../../Media/{$type}s/{$user['photo']}");
    
            $qry_2 = "delete from log_data where email = '{$user['email']}'";
            $connection->query($qry_2);
            
        } elseif ($type == "study_material") {
            $qry_3 = "select material from study_materials where id = $id";
            $material = $connection->query($qry_3)->fetch_assoc();

            @unlink("../../Media/StudyMaterials/{$material['material']}");
        }

        $qry_4 = "delete from {$type}s where id = $id";
        $connection->query($qry_4);
        
        $response["status"] = "success";
        $response["message"] = "Record deleted successfully.";
    } else {
        $response["message"] = "Invalid request.";
    }

    echo json_encode($response);
?>
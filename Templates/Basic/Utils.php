<?php
    session_start();
    $user_email = $_SESSION["user_email"] ?? null;
    $user_type = $_SESSION["user_type"] ?? null;

    $host = "localhost";
    $user = "root";
    $password = "";
    $database = "code_morph";

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    
    $connection = new mysqli(
        $host,
        $user,
        $password,
        $database
    );

    function cleanInput(string|array $input): string|array {
        global $connection;
        
        return is_array($input)
               ? array_map("cleanInput", $input)
               : $connection->real_escape_string(trim($input));
    }

    function canManage(string $type): bool {
        global $user_type;
        
        $manage = [
            "admin" => ["regulator"],
            "regulator" => [
                "teacher", 
                "student", 
                "department", 
                "course"
            ],
            "teacher" => [
                "study_material",
                "test_question",
                "simulation"
            ]
        ];
        
        return in_array($type, $manage[$user_type] ?? []);
    }

    function slugify(string $title): string {
        return str_replace(" ", "", ucwords(strtolower($title)));
    }
?>
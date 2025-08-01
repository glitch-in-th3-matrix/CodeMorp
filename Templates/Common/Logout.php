<?php
    session_start();
    session_destroy();
    header("Location: ../Common/Index.php");
    exit;
?>
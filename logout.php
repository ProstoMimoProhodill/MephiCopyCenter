<?php

require_once "config.php";
session_start();

$id_session = $_SESSION['id'];
$_SESSION = array();

session_destroy();
header("location:/");

 ?>

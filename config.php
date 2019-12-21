<?php

// $conn =new mysqli("localhost", "root", "zx", "party_map_db");

define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', 'zx');
define('DB_DATABASE', 'mephicopycenter');
$db = mysqli_connect(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_DATABASE);
$db->set_charset("utf8");

 ?>

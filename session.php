<?php

require_once "config.php";
session_start();
$id_session = $_SESSION['id'];

//get info about session
$sql = "SELECT `username` FROM `users` WHERE `id_user` = '$id_session'";
$result = mysqli_query($db,$sql);
$row = mysqli_fetch_array($result,MYSQLI_ASSOC);
echo "" . $row['username'];

//update
$sql = "UPDATE `users` SET `last_time` = now() WHERE `id_user` = '$id_session'";
$result = mysqli_query($db,$sql);

// delete session (2 min)
$sql = "SELECT * FROM `users` WHERE (now() - `last_time`) >= 120 AND `last_time` is NOT NULL";
$result = mysqli_query($db,$sql);
$row = mysqli_fetch_array($result,MYSQLI_ASSOC);
// $id_user = ""; // trying to create id_user - string but $length is null
// $count = 0;
// $length = mysqli_num_rows($result);
// while($row = $result->fetch_assoc()) {
//   if($count == $length-1){
//     $id_user = "" . $row['id_user'];
//   }
//   $id_user = "" . $id_user . "" . $row['id_user'] . " AND `id_user` = ";
//   $count = $count + 1;
//   echo "a  " . $count . "b       " . $lenght;
// }
// echo "" . $id_user;
$id_user = $row['id_user'];
$sql = "UPDATE `users` SET `last_time` = NULL WHERE `id_user` = '$id_user'";
$result = mysqli_query($db,$sql);

?>

<?php

// require "session.php";
require_once "config.php";
session_start();

if($_SERVER["REQUEST_METHOD"] == "POST") {

      $username = mysqli_real_escape_string($db,$_POST['username']);
      $password = mysqli_real_escape_string($db,$_POST['password']);
      $sql = "SELECT `id_user` FROM `users` WHERE username = '$username' and password = '$password'";
      $result = mysqli_query($db,$sql);
      $count = mysqli_num_rows($result);

      if($count == 1) {
         $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
         $_SESSION['id'] = $row['id_user'];
         echo "session " . $_SESSION['id'];
      }else {
         $error = "Your Login Name or Password is invalid";
         echo "ERROR:login.php";
      }

   }

header("location:/");

 ?>

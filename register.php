<?php

require_once "config.php";
session_start();

if($_SERVER["REQUEST_METHOD"] == "POST") {
  $username = mysqli_real_escape_string($db,$_POST['username']);
  $email = mysqli_real_escape_string($db,$_POST['email']);
  $password = mysqli_real_escape_string($db,$_POST['password']);
  $confirm_password = mysqli_real_escape_string($db, $_POST['confirm_password']);

  if($username != "admin"){
    if($password == $confirm_password){
      $sql = "INSERT INTO `users`(`username`, `password`, `email`) VALUES ('$username', '$password', '$email')";
      $result = mysqli_query($db,$sql);

      $sql = "SELECT `id_user` FROM `users` WHERE username = '$username' and password = '$password'";
      $result = mysqli_query($db,$sql);
      $row = mysqli_fetch_array($result,MYSQLI_ASSOC);

      $_SESSION['id'] = $row['id_user'];
      echo "session " . $_SESSION['id'];
    }else {
      echo "<script type='text/javascript'>alert('Error!')</script>";
      header("location:/register.html");
    }
  }
}

header("location:/");

?>

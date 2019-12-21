<?php

require_once "config.php";
session_start();
$id_session = $_SESSION['id'];

// //get info about session
// $sql = "SELECT * FROM `Format`";
// $result = mysqli_query($db,$sql);
// $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
//
//
// echo '<table>';
// echo '<tr><td>id_user</td> <td>username</td></tr>';
// while ($record = mysqli_fetch_array($result,MYSQLI_ASSOC)) {
// 	echo '<tr> <td>' . $record['id_format'] . '</td> <td>' . $record['name'] . '</td> </tr>';
// }
// echo '</table>';

if($_SERVER["REQUEST_METHOD"] == "POST") {
  $type = mysqli_real_escape_string($db,$_POST['type']);

  if($type == "create_get"){
    $return = array();
    // format
    $f = array();
    $sql = " SELECT * FROM `Format`";
    $result = mysqli_query($db,$sql);
    while ($record = mysqli_fetch_array($result,MYSQLI_ASSOC)) {
      array_push($f, $record);
    }
    // quality
    $q = array();
    $sql = "SELECT * FROM `Quality`";
    $result = mysqli_query($db,$sql);
    while ($record = mysqli_fetch_array($result,MYSQLI_ASSOC)) {
      array_push($q, $record);
    }
    // decor
    $d = array();
    $sql = "SELECT * FROM `Decor`";
    $result = mysqli_query($db,$sql);
    while ($record = mysqli_fetch_array($result,MYSQLI_ASSOC)) {
      array_push($d, $record);
    }

    $return['format'] = $f;
    $return['quality'] = $q;
    $return['decor'] = $d;
    echo json_encode($return);

  }elseif($type == "create_post"){
    //push order
    // $sql = "INSERT INTO `Orders`(`id_user`) VALUES ('$id_session')";
    // $result = mysqli_query($db,$sql);

    //get id_order
    //push consistent data
    //get
    // $sql = "INSERT INTO `Orders`(`id_user`) VALUES ('$id_session')";
    // $result = mysqli_query($db,$sql);
  }elseif($type == "see"){
    echo "see";
  }

}

?>

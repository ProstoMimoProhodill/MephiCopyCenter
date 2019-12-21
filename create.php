<?php

require_once "config.php";
session_start();
$id_session = $_SESSION['id'];

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
    // edition
    $e = array();
    $sql = "SELECT * FROM `Edition`";
    $result = mysqli_query($db,$sql);
    while ($record = mysqli_fetch_array($result,MYSQLI_ASSOC)) {
      array_push($e, $record);
    }

    $return['format'] = $f;
    $return['quality'] = $q;
    $return['decor'] = $d;
    $return['edition'] = $e;
    echo json_encode($return);

  }elseif($type == "create_post"){
    $id_format = (int)mysqli_real_escape_string($db,$_POST['id_format']);
    $id_quality = (int)mysqli_real_escape_string($db,$_POST['id_quality']);
    $id_decor = (int)mysqli_real_escape_string($db,$_POST['id_decor']);
    $url = mysqli_real_escape_string($db,$_POST['url']);
    $price = (int)mysqli_real_escape_string($db,$_POST['price']);
    $edition = (int)mysqli_real_escape_string($db,$_POST['edition']);
    $processed = (int)mysqli_real_escape_string($db,$_POST['processed']);
    $consistent_total = (int)mysqli_real_escape_string($db,$_POST['consistent_total']);

    //push order
    $sql = "INSERT INTO `Orders`(`id_user`, `created_at`) VALUES ('$id_session', now())";
    $result = mysqli_query($db,$sql);

    //get id_order
    $sql = "SELECT MAX( CAST( `id_order` AS UNSIGNED) ) as max FROM `Orders` WHERE `id_user` = '$id_session'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_order = $row['max'];

    //push consistent data
    $sql = "INSERT INTO `ConsistentData`(`id_order`, `id_format`, `id_quality`, `id_decor`, `url`, `edition`, `price`) VALUES ('$id_order', '$id_format', '$id_quality', '$id_decor', '$url', '$edition', '$price')";
    $result = mysqli_query($db,$sql);

    //get id_consistent_data
    $sql = "SELECT `id_consistent_data` FROM `ConsistentData` WHERE `id_order` = '$id_order'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_consistent_data = $row['id_consistent_data'];

    //push processed orders
    $sql = "INSERT INTO `ProcessedOrders`(`id_consistent_data`, `refused`) VALUES ('$id_consistent_data', '$processed')";
    $result = mysqli_query($db,$sql);

    //get id_processed_order
    $sql = "SELECT `id_processed_order` FROM `ProcessedOrders` WHERE `id_consistent_data` = '$id_consistent_data'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_processed_order = $row['id_processed_order'];

    //push consistent total data
    $sql = "INSERT INTO `ConsistentTotalData`(`id_processed_order`, `refused`) VALUES ('$id_processed_order', '$consistent_total')";
    $result = mysqli_query($db,$sql);
  }elseif($type == "edit_get_orders"){
    //orders
    $o = array();
    $sql = "SELECT * FROM `Orders`";
    $result = mysqli_query($db,$sql);
    while ($record = mysqli_fetch_array($result,MYSQLI_ASSOC)) {
      array_push($o, $record);
    }

    echo json_encode($o);
  }elseif($type == "edit_get_orders_data"){
    //order -> id_consistent_total_data
    $id_order = (int)mysqli_real_escape_string($db,$_POST['id_order']);

    //get id_consistent_data
    $sql = "SELECT `id_consistent_data` FROM `ConsistentData` WHERE `id_order` = '$id_order'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_consistent_data = $row['id_consistent_data'];

    //get id_processed_order
    $sql = "SELECT `id_processed_order` FROM `ProcessedOrders` WHERE `id_consistent_data` = '$id_consistent_data'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_processed_order = $row['id_processed_order'];

    //get id_processed_order
    $sql = "SELECT `id_consistent_total_data` FROM `ConsistentTotalData` WHERE `id_processed_order` = '$id_processed_order'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_consistent_total_data = $row['id_consistent_total_data'];

    echo "" . $id_consistent_total_data;
  }elseif($type == "edit_post"){
    $id_consistent_total_data = (int)mysqli_real_escape_string($db,$_POST['id_consistent_total_data']);
    $printed = (int)mysqli_real_escape_string($db,$_POST['printed']);
    $decorated = (int)mysqli_real_escape_string($db,$_POST['decorated']);

    //push printed orders
    $sql = "INSERT INTO `PrintedOrders`(`id_consistent_total_data`, `done`) VALUES ('$id_consistent_total_data', '$printed')";
    $result = mysqli_query($db,$sql);

    //get id_printed_order
    $sql = "SELECT `id_printed_order` FROM `PrintedOrders` WHERE `id_consistent_total_data` = '$id_consistent_total_data'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_printed_order = $row['id_printed_order'];

    //push decorated orders
    $sql = "INSERT INTO `DecoredOrders`(`id_printed_order`, `done`) VALUES ('$id_printed_order', '$decorated')";
    $result = mysqli_query($db,$sql);
  }

}

?>

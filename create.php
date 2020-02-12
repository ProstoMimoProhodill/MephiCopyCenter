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

    //balance
    $b = array();
    $sql = "SELECT MIN(`balance`) as `balance` FROM `Balance`";
    $result = mysqli_query($db,$sql);
    while ($record = mysqli_fetch_array($result,MYSQLI_ASSOC)) {
      array_push($b, $record);
    }

    $return['format'] = $f;
    $return['quality'] = $q;
    $return['decor'] = $d;
    $return['edition'] = $e;
    $return['balance'] = $b;
    echo json_encode($return);

  }elseif($type == "create_post"){
    $lock = (int)mysqli_real_escape_string($db,$_POST['lock']);
    if($lock == 1){
      $sql = "LOCK TABLES `Orders` WRITE, `ConsistentData` WRITE, `ConsistentTotalData` WRITE, `ProcessedOrders` WRITE, `PrintedOrders` WRITE, `DecoredOrders` WRITE, `Balance` WRITE";
      $result = mysqli_query($db,$sql);
    }

    //get Balance
    $sql = "SELECT MIN(`balance`) as `balance` FROM `Balance`";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $balance = $row['balance'];

    if($balance == 0){
      echo "error";
      exit();
    }

    sleep(3);

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

    //get id_consistent_total_data
    $sql = "SELECT `id_consistent_total_data` FROM `ConsistentTotalData` WHERE `id_processed_order` = '$id_processed_order'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_consistent_total_data = $row['id_consistent_total_data'];

    //push printed orders
    $sql = "INSERT INTO `PrintedOrders`(`id_consistent_total_data`, `done`) VALUES ('$id_consistent_total_data', '0')";
    $result = mysqli_query($db,$sql);

    //get $id_printed_order
    $sql = "SELECT `id_printed_order` FROM `PrintedOrders` WHERE `id_consistent_total_data` = '$id_consistent_total_data'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_printed_order = $row['id_printed_order'];

    //push decored orders
    $sql = "INSERT INTO `DecoredOrders`(`id_printed_order`, `done`) VALUES ('$id_printed_order', '0')";
    $result = mysqli_query($db,$sql);

    //push balance
    $balance = $balance - $edition;
    $sql = "INSERT INTO `Balance`(`balance`, `time`) VALUES ('$balance', NOW())";
    $result = mysqli_query($db,$sql);

    if($lock == 1){
      $sql = "UNLOCK TABLES";
      $result = mysqli_query($db,$sql);
    }
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
    $id_order = (int)mysqli_real_escape_string($db,$_POST['id_order']);

    $return = array();
    $d = array();
    $sql = "SELECT * FROM `ConsistentData` WHERE `id_order` = '$id_order'";
    $result = mysqli_query($db,$sql);
    while ($record = mysqli_fetch_array($result,MYSQLI_ASSOC)) {
      array_push($d, $record);
    }

    $return['data'] = $d;

    //get id_consistent_data
    $sql = "SELECT `id_consistent_data` FROM `ConsistentData` WHERE `id_order` = '$id_order'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_consistent_data = $row['id_consistent_data'];

    //get id_processed_order
    $sql = "SELECT * FROM `ProcessedOrders` WHERE `id_consistent_data` = '$id_consistent_data'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_processed_order = $row['id_processed_order'];
    $return['processed'] = (int)$row['refused'];

    //get id_consistent_total_data
    $sql = "SELECT * FROM `ConsistentTotalData` WHERE `id_processed_order` = '$id_processed_order'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_consistent_total_data = $row['id_consistent_total_data'];
    $return['consistent_total'] = (int)$row['refused'];

    //get $id_printed_order
    $sql = "SELECT * FROM `PrintedOrders` WHERE `id_consistent_total_data` = '$id_consistent_total_data'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_printed_order = $row['id_printed_order'];
    $return['printed'] = (int)$row['done'];

    //get $id_decored_order
    $sql = "SELECT * FROM `DecoredOrders` WHERE `id_printed_order` = '$id_printed_order'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_decored_order = $row['id_decored_order'];
    $return['decored'] = (int)$row['done'];

    echo json_encode($return);
  }elseif($type == "edit_post"){
    $lock = (int)mysqli_real_escape_string($db,$_POST['lock']);
    if($lock == 1){
      $sql = "LOCK TABLES `Orders` WRITE, `ConsistentData` WRITE, `ConsistentTotalData` WRITE, `ProcessedOrders` WRITE, `PrintedOrders` WRITE, `DecoredOrders` WRITE, `Balance` WRITE";
      $result = mysqli_query($db,$sql);
    }else{
      echo "error";
      exit();
    }

    $id_order = (int)mysqli_real_escape_string($db,$_POST['id_order']);
    $id_format = (int)mysqli_real_escape_string($db,$_POST['id_format']);
    $id_quality = (int)mysqli_real_escape_string($db,$_POST['id_quality']);
    $id_decor = (int)mysqli_real_escape_string($db,$_POST['id_decor']);
    $url = mysqli_real_escape_string($db,$_POST['url']);
    $price = (int)mysqli_real_escape_string($db,$_POST['price']);
    $edition = (int)mysqli_real_escape_string($db,$_POST['edition']);
    $processed = (int)mysqli_real_escape_string($db,$_POST['processed']);
    $consistent_total = (int)mysqli_real_escape_string($db,$_POST['consistent_total']);
    $printed = (int)mysqli_real_escape_string($db,$_POST['printed']);
    $decored = (int)mysqli_real_escape_string($db,$_POST['decored']);

    //update ConsistentData
    $sql = "UPDATE `ConsistentData` SET `id_format` = '$id_format', `id_quality` = '$id_quality', `id_decor` = '$id_decor', `edition` = '$edition', `price` = '$price', `url` = '$url' WHERE `id_order` = '$id_order'";
    $result = mysqli_query($db,$sql);

    //get id_consistent_data
    $sql = "SELECT `id_consistent_data` FROM `ConsistentData` WHERE `id_order` = '$id_order'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_consistent_data = $row['id_consistent_data'];

    //update ProcessedOrders
    $sql = "UPDATE `ProcessedOrders` SET `refuse` = '$processed' WHERE `id_consistent_data` = '$id_consistent_data'";
    $result = mysqli_query($db,$sql);

    //get id_processed_order
    $sql = "SELECT * FROM `ProcessedOrders` WHERE `id_consistent_data` = '$id_consistent_data'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_processed_order = $row['id_processed_order'];

    //update ConsistentTotalData
    $sql = "UPDATE `ConsistentTotalData` SET `refuse` = '$consistent_total' WHERE `id_processed_order` = '$id_processed_order'";
    $result = mysqli_query($db,$sql);

    //get id_consistent_total_data
    $sql = "SELECT * FROM `ConsistentTotalData` WHERE `id_processed_order` = '$id_processed_order'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_consistent_total_data = $row['id_consistent_total_data'];

    //update PrintedOrders
    $sql = "UPDATE `PrintedOrders` SET `done` = '$printed' WHERE `id_consistent_total_data` = '$id_consistent_total_data'";
    $result = mysqli_query($db,$sql);

    //get $id_printed_order
    $sql = "SELECT * FROM `PrintedOrders` WHERE `id_consistent_total_data` = '$id_consistent_total_data'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $id_printed_order = $row['id_printed_order'];

    //update DecoredOrders
    $sql = "UPDATE `DecoredOrders` SET `done` = '$decored' WHERE `id_printed_order` = '$id_printed_order'";
    $result = mysqli_query($db,$sql);

    if($lock == 1){
      $sql = "UNLOCK TABLES";
      $result = mysqli_query($db,$sql);
    }
  }elseif($type == "edit_balance"){
    //clear table
    $sql = "TRUNCATE TABLE `Balance`";
    $result = mysqli_query($db,$sql);

    //init new
    $balance = (int)mysqli_real_escape_string($db,$_POST['balance']);
    $sql = "INSERT INTO `Balance`(`balance`, `time`) VALUES ('$balance', NOW())";
    $result = mysqli_query($db,$sql);
  }
}

?>

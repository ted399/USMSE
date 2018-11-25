<?php

$connect = mysqli_connect("localhost", "root", "root", "usmse");

$filename = "object.json";

$data = file_get_contents($filename);

$array = json_decode($data, true);

foreach($array as $row){
    $sql = "INSERT INTO tbl_offers(name, price, description, location, link) VALUES ('".$row["title"]."', '".$row["price"]."', '".$row["desc"]."', '".$row["location"]."', '".$row["link"]."')";

    mysqli_query($connect, $sql);
}

echo "Data inserted into database";
?>

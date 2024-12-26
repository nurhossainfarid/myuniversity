<?php
$hostname = "daffodil.net";
$username = "software321";
$password = "software@321";
$database = "software";

$conn = new mysqli($hostname, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Connected successfully!";
}
?>
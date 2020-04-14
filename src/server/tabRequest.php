<?php
// File: tabRequest.php
ini_set('display_errors', 'off');
error_reporting(0);

//Verbindung zur DB:
$host = "localhost";
$port = "5432";
$dbname = "test";
$user = "tester";
$password = "tester";
$conn_string = "host=$host port=$port dbname=$dbname user=$user password=$password";

try{
   $dbconn = pg_connect ($conn_string);  
   if (!$dbconn) {
      throw new Exception ('Keine Verbindung mit der Datenbank!');
   }

   //Query:         
   $sql = "SELECT b_idbundesland,b_bundesland,b_einwohner FROM rki.bundeslaender ORDER BY b_bundesland";
   $result = pg_query($dbconn,$sql);
      
   if (!$result) {
      throw new Exception ('Query nicht erfolgreich!');
   }
   else{
      $array = pg_fetch_all($result);
		  
	  if (!$array){
         throw new Exception ('Fetch nicht erfolgreich!');
      }
	  else{
		 echo json_encode($array);
	  }
	}      
}
catch (Exception $e){
   handleError($e->getMessage());
}

function handleError ($string){  
   echo strip_tags(utf8_decode("FEHLER: " . $string));
   die();
}
?>
         
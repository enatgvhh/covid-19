<?php
// File: chartRequest.php
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
   if (isset ($_GET['value1']) AND $_GET['value1'] !== '' AND isset ($_GET['value2']) AND $_GET['value2'] !== ''){        
      $invid = stripslashes($_GET['value1']);
	  $para = stripslashes($_GET['value2']);
	  $sql = "SELECT c_bundesland, date_part('year', c_meldedatum) as year, date_part('month', c_meldedatum)-1 as month, date_part('day', c_meldedatum) as day, " . $para . " FROM rki.covid19 WHERE fk_b_idbundesland = '" . $invid . "' AND " . $para . " IS NOT NULL ORDER BY c_meldedatum";
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
   else{
      throw new Exception ('Server hat keinen Parameter empfangen!');
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
         
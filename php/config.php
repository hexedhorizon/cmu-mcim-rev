<?php 
	define('BASE_PATH', 'http://127.0.0.1/cmu-mcim-master/mobile/www/php');
	define('DB_HOST','127.0.0.1');
	define('DB_NAME', 'cmu-micm-temp');
	define('DB_USERNAME', 'root');
	define('DB_PASSWORD', '');

	$conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);

	if(mysqli_connect_errno()){
		echo ('<h1>No Connection</h1>'.mysqli_connect_error());
		exit();
	}
?>
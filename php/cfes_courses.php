<?php
		include_once('config.php');
		
		$sql = 'SELECT*
				FROM courses
			/*	INNER JOIN courses ON colleges.col_id = courses.col_id */
				where col_id=6';

		$query = $conn->query($sql);
			if($query->num_rows > 0){
				while($row = $query -> fetch_array())
				{
					$coursename =  $row['course_name'];
					$coursedescription =  $row['course_description'];

					
					$result[] = array ('course_name'=>$coursename,
										'course_description'=>$coursedescription
										);
				}
				$json = array('status' =>1 ,'info' => $result);
			}
			else{
				$json = array('status'=>0, 'msg'=> 'Userid not defined');
			}	
				@mysqli_close($conn);
				header('Content-type: application/json');
				echo json_encode($json);
?>
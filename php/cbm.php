<?php
		include_once('config.php');

		$sql = 'SELECT*
				FROM colleges
			/*	INNER JOIN courses ON colleges.col_id = courses.col_id */
				where col_id=3';

		$query = $conn->query($sql);
			if($query->num_rows > 0){
				while($row = $query -> fetch_array())
				{
					$colname = $row['col_name'];
					$coloverview = $row['col_overview'];
					$colvision = $row['col_vision'];
					$colmission = $row['col_mission'];
					$colgoals = $row['col_goals'];
					$colobjectives = $row['col_objectives'];
					

			        
					
					$result[] = array ('col_name'=>$colname, 
										'col_overview'=>$coloverview,
										'col_vision'=>$colvision,
										'col_mission'=>$colmission,
										'col_goals'=>$colgoals,
										'col_objectives'=>$colobjectives
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

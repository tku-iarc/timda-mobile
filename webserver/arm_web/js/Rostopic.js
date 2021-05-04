
/*------------------------------------------------------------------------------------*/
var ros = new ROSLIB.Ros({
  url: 'ws://localhost:9090'
});
// var ros = new ROSLIB.Ros({
//   url: 'ws://192.168.50.200'
// });
/*------------------------------------------------------------------------------------*/
//claim the rostopic variable
var p2p_pose_msg_pub_ = new ROSLIB.Topic({
  ros: ros,
  name: '/left_arm/p2p_pose_msg',
  messageType: 'manipulator_h_base_module_msgs/P2PPose'
});
var joint_pose_msg_pub_ = new ROSLIB.Topic({
  ros: ros,
  name: '/left_arm/joint_pose_msg',
  messageType: 'manipulator_h_base_module_msgs/JointPose'
});
var table = new ROSLIB.Topic({
  ros: ros,
  name: '/recieve_html',
  messageType: '/html_test/html_msg'
});
/*------------------------------------------------------------------------------------*/
//joint state publish
function Sendjoint() {
  var joint_list = ["joint1", "joint2", "joint3", "joint4", "joint5", "joint6", "joint7"];
  var joint_value = [];
  a1 = joint_list[0];
  for (i = 0; i < 7; i++) {
    a = joint_list[i];
    joint_value.push(parseFloat(document.getElementById(a).value));
  }
  var joint_msg = new ROSLIB.Message({

    name: joint_list,
    value: joint_value

  });
  joint_pose_msg_pub_.publish(joint_msg);
}
/*------------------------------------------------------------------------------------*/
function Sendp2p() {
  var p2p_pose_msg = new ROSLIB.Message({
    position: {
      x: parseFloat(document.getElementById("positionInput_x").value),
      y: parseFloat(document.getElementById("positionInput_y").value),
      z: parseFloat(document.getElementById("positionInput_z").value)
    },
    orientation: {
      x: parseFloat(document.getElementById("orientationInput_roll").value),
      y: parseFloat(document.getElementById("orientationInput_pitch").value),
      z: parseFloat(document.getElementById("orientationInput_yaw").value),
      w: parseFloat(document.getElementById("orientationInput_phi").value)
    }
  });
  var p2p_msg = new ROSLIB.Message({
    name: "arm",
    pose: p2p_pose_msg,
    phi: 0,
    speed: parseInt(document.getElementById("speedInput").value)
  });
  p2p_pose_msg_pub_.publish(p2p_msg);
}
/*------------------------------------------------------------------------------------*/
function ToInputValue(newValue, name, num) {
  document.getElementsByName(name)[num].value = newValue;
}
function ToSliderValue(newValue, name, num) {
  document.getElementsByName(name)[1].value = newValue;
  document.getElementsByName(name)[num].value = newValue;
}
/*------------------------------------------------------------------------------------*/
//push the table number
function Sendtable(table_number) {
  if (table_number == 1) {
    var num = 1;
  }
  else if (table_number == 2) {
    var num = 2;
  }
  else if (table_number == 3) {
    var num = 3;
  }
  else if (table_number == 4) {
    var num = 4;
  }
  else if (table_number == 5) {
    var num = 5
  }
  else if (table_number == 6) {
    var num = 6
  }

  var id_table = new ROSLIB.Message({
    id: num
  });

  table.publish(id_table);
}
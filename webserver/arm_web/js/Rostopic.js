// var ros = new ROSLIB.Ros({
// url: 'ws://localhost:9090'
// });
var ros = new ROSLIB.Ros({
  url: 'ws://192.168.50.200'
});
var ini_pose_msg_pub_ = new ROSLIB.Topic({
  ros: ros,
  name: '/ini_pose_msg',
  messageType: 'std_msgs/String'
});
var set_pose_msg_pub_ = new ROSLIB.Topic({
  ros: ros,
  name: '/set_mode_msg',
  messageType: 'std_msgs/String'
});
var joint_pose_msg_pub_ = new ROSLIB.Topic({
  ros: ros,
  name: '/joint_pose_msg',
  messageType: 'manipulator_h_base_module_msgs/JointPose'
});
var p2p_pose_msg_pub_ = new ROSLIB.Topic({
  ros: ros,
  name: '/p2p_pose_msg',
  messageType: 'manipulator_h_base_module_msgs/P2PPose'
});

function Sendp2p() {
  var p2p_pose_msg = new ROSLIB.Message({
    position: {
      x: parseInt(document.getElementById("position_x")),
      y: parseInt(document.getElementById("position_y")),
      z: parseInt(document.getElementById("position_z")),
    },

    orientation: {
      x: parseInt(document.getElementById("orientation_roll")),
      y: parseInt(document.getElementById("orientation_pitch")),
      z: parseInt(document.getElementById("orientation_yaw")),
      w: parseInt(document.getElementById("orientatio_phi"))
    }
  });
  var p2p_msg = new ROSLIB.Message({
    name: "fuck",
    pose: p2p_pose_msg,
    phi: 0,
    speed: 0
  });
  p2p_pose_msg_pub_.publish(p2p_msg);
  var listener = new ROSLIB.Topic({
    ros: ros,
    name: '/p2p_pose_msg',
    messageType: 'manipulator_h_base_module_msgs/P2PPose'
  });

  listener.subscribe(function (message) {
    console.log('Received message on ' + listener.name + ': ' + message.data);
    listener.unsubscribe();
  });
};
function ToInputValue(newValue, name, num) {
  document.getElementsByName(name)[num].value = newValue;
}

function ToSliderValue(newValue, name, num) {
  /*if (newValue > 100) {
      newValue = 100;
  }*/
  document.getElementsByName(name)[1].value = newValue;
  document.getElementsByName(name)[num].value = newValue;
}
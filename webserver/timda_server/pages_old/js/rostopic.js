// Connecting to ROS
// -----------------
if (location.hostname == "") {
  location.hostname = "localhost";
}

var ros = new ROSLIB.Ros({
  url: "ws://" + location.hostname + ":9090",
});

ros.on("connection", function () {
  console.log("Connected to websocket server.");
  $("#ros-status").text("\tOK");
});

ros.on("error", function (error) {
  console.log("Error connecting to websocket server: ", error);
  $("#ros-status").text("\tERROR");
});

ros.on("close", function () {
  console.log("Connection to websocket server closed.");
  $("#ros-status").text("\tCLOSE");
});

// Connecting to SocketIO
// -----------------
$(function () {
  var socket = io();
  socket.on("connect", function () {
    console.log("IO STATUS: ", socket.connected);
    $("#io-status").text(socket.connected);
  });
  socket.on("disconnect", function () {
    console.log("IO STATUS: ", socket.connected);
    $("#io-status").text(socket.connected);
  });
  $("#shutdown").click(function () {
    var c = confirm("Are you sure you want to shut down?");
    if (c) {
      socket.emit("shutdown", "");
    }
  });
});
// Show rosbridge connection info
// -----------------
$(function () {
  $("#host-info").text(location.hostname + ":9090");
});

document.oncontextmenu = function () {
  return false;
}; // 防右鍵選單
var joy3Param = { title: "joystick3" };
var Joy3 = new JoyStick("joy3Div", joy3Param);

var joy3IinputPosX = document.getElementById("joy3PosizioneX");
var joy3InputPosY = document.getElementById("joy3PosizioneY");
var joy3Direzione = document.getElementById("joy3Direzione");
var joy3X = document.getElementById("joy3X");
var joy3Y = document.getElementById("joy3Y");

setInterval(function () {
  joy3IinputPosX.value = Joy3.GetPosX();
}, 50);
setInterval(function () {
  joy3InputPosY.value = Joy3.GetPosY();
}, 50);
setInterval(function () {
  joy3Direzione.value = Joy3.GetDir();
}, 50);
setInterval(function () {
  joy3X.value = Joy3.GetX();
}, 50);
setInterval(function () {
  joy3Y.value = Joy3.GetY();
}, 50);

$("#powerRange").on("input change", function () {
  $("#powerShow").val($("#powerRange").val());
});

// Publishing cmd_vel of Joystick
// ------------------
var cmdVel = new ROSLIB.Topic({
  ros: ros,
  name: "/mobile/cmd_vel",
  messageType: "geometry_msgs/Twist",
});

var twist = new ROSLIB.Message({
  linear: {
    x: 0.0,
    y: 0.0,
    z: 0.0,
  },
  angular: {
    x: 0.0,
    y: 0.0,
    z: 0.0,
  },
});

/**
 *  Handling Real Joystick
 **/
var gamepads = {};

function gamepadHandler(event, connecting) {
  var gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]

  if (connecting) {
    gamepads[gamepad.index] = gamepad;
    optionText = "Gamepad " + gamepad.index;
    optionValue = gamepad.index;
    $("#gamepadList").append(new Option(optionText, optionValue));
  } else {
    delete gamepads[gamepad.index];
    $("#gamepadList option[value=" + gamepad.index + "]").remove();
    for (i = 0; i < countNum; i++) {
      twist.linear.x = 0.0;
      twist.linear.y = 0.0;
      twist.angular.z = 0.0;
      cmdVel.publish(twist);
      // console.log(twist.linear.x+", "+twist.linear.y+", "+twist.angular.z);
    }
  }
}

var countGP = 0;
function gamepadController() {
  if ($("#gamepadList").val() != null) {
    var i = $("#gamepadList").val();
    var gp = navigator.getGamepads()[i];
    const gpt = 0.5;
    if (
      Math.abs(gp.axes[0]) > gpt ||
      Math.abs(gp.axes[1]) > gpt ||
      Math.abs(gp.axes[2]) > gpt
    ) {
      twist.linear.x = gp.axes[1] * -1 * $("#powerRange").val();
      twist.linear.y = gp.axes[0] * -1 * $("#powerRange").val();
      twist.angular.z = gp.axes[2] * -0.5 * $("#powerRange").val();
      cmdVel.publish(twist);
      // console.log(twist.linear.x+", "+twist.linear.y+", "+twist.angular.z);
      countGP = 0;
    } else {
      if (countGP <= countNum) {
        twist.linear.x = 0.0;
        twist.linear.y = 0.0;
        twist.angular.z = 0.0;
        cmdVel.publish(twist);
        // console.log(twist.linear.x+", "+twist.linear.y+", "+twist.angular.z);
      }
      countGP += 1;
    }
    Joy3.DrawJoy(gp.axes[0] * 100, gp.axes[1] * 100, gp.axes[2] * -100);
  }
}

window.addEventListener(
  "gamepadconnected",
  function (e) {
    gamepadHandler(e, true);
  },
  false
);
window.addEventListener(
  "gamepaddisconnected",
  function (e) {
    gamepadHandler(e, false);
  },
  false
);

var countJoy = 0;
const countNum = 10;
function vJoy() {
  if (Joy3.GetPressed() === 1) {
    // console.log("Translation");
    twist.linear.x = (Number(Joy3.GetY()) / 100) * $("#powerRange").val();
    twist.linear.y =
      ((Number(Joy3.GetX()) * -1) / 100) * $("#powerRange").val();
    twist.angular.z = 0.0;
    cmdVel.publish(twist);
    // console.log(twist.linear.x+", "+twist.linear.y+", "+twist.angular.z);
    countJoy = 0;
  } else if (Joy3.GetPressed() == 2) {
    // console.log("Rotation");
    var maxPowerLimit = 50;
    var minPowerLimit = 0;
    var powerR = Math.sqrt(Math.pow(Joy3.GetX(), 2) + Math.pow(Joy3.GetY(), 2));
    var percent = (powerR - 0) / (100 - 0);
    var power = percent * (maxPowerLimit - minPowerLimit) + minPowerLimit;
    if (power > maxPowerLimit) {
      power = maxPowerLimit;
    }
    if (power < minPowerLimit) {
      power = minPowerLimit;
    }
    twist.linear.x = 0.0;
    twist.linear.y = 0.0;
    twist.angular.z =
      (Number(Math.sign(Joy3.GetAng()) * power.toFixed()) / 100) *
      $("#powerRange").val();
    cmdVel.publish(twist);
    // console.log(twist.linear.x+", "+twist.linear.y+", "+twist.angular.z);
    countJoy = 0;
  } else {
    if (countJoy <= countNum) {
      twist.linear.x = 0.0;
      twist.linear.y = 0.0;
      twist.angular.z = 0.0;
      cmdVel.publish(twist);
      // console.log(twist.linear.x+", "+twist.linear.y+", "+twist.angular.z);
    }
    countJoy += 1;
  }
}

var joyInterval;
var gamepadInterval;
$("input[type=radio][name=radio]").change(function () {
  if ($("input[name=radio]:checked", "#controlForm").val() == "No Manual") {
    KeyboardState(false);
    // Disable joystick
    Joy3.SetReturnToCenter(false);
    $("#joystick").css("background-color", "rgba(0, 0, 0, .1)");

    clearInterval(joyInterval);
    clearInterval(gamepadInterval);
    for (i = 0; i < countNum; i++) {
      twist.linear.x = 0.0;
      twist.linear.y = 0.0;
      twist.angular.z = 0.0;
      cmdVel.publish(twist);
      // console.log(twist.linear.x+", "+twist.linear.y+", "+twist.angular.z);
    }
  } else if (
    $("input[name=radio]:checked", "#controlForm").val() == "Virtual Joystick"
  ) {
    
    Joy3.SetReturnToCenter(true);
    $("#joystick").css("background-color", "");
    joyInterval = setInterval(vJoy, 50);
    clearInterval(gamepadInterval);
  } else if (
    $("input[name=radio]:checked", "#controlForm").val() == "Real Joystick"
  ) {
    Joy3.SetReturnToCenter(false);
    $("#joystick").css("background-color", "rgba(0, 0, 0, .1)");
    // Use real joystick
    // if (gamepads[$('#gamepadList').optionValue])
    // $('#gamepadList option[value='+gamepad.index+']').remove();
    gamepadInterval = setInterval(gamepadController, 50);
    clearInterval(joyInterval);
    for (i = 0; i < countNum; i++) {
      twist.linear.x = 0.0;
      twist.linear.y = 0.0;
      twist.angular.z = 0.0;
      cmdVel.publish(twist);
      // console.log(twist.linear.x+", "+twist.linear.y+", "+twist.angular.z);
    }
  } else if (
    $("input[name=radio]:checked", "#controlForm").val() == "KeyboardControl"
  ) {
    KeyboardState(this.checked);
  }
});

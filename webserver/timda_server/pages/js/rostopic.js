
$("#powerRange").on("input change", function () {
  $("#powerShow").val($("#powerRange").val());
});

// Connecting to SocketIO
// -----------------
$(function () {
  var socket = io();
  socket.connect('http://localhost:8081/index.html');
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


// Publishing cmd_vel of Joystick
// ------------------

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


var joyInterval;
var gamepadInterval;
$("input[type=radio][name=radio]").change(function () {
  if ($("input[name=radio]:checked", "#controlForm").val() == "No Manual") {
    // console.log("123")
    KeyboardState(false);
    VirtualState(false)
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
    KeyboardState(false);
    VirtualState(this.checked)
    clearInterval(gamepadInterval);
  } else if (
    $("input[name=radio]:checked", "#controlForm").val() == "Real Joystick"
  ) {
    KeyboardState(false);
    VirtualState(false)
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
    VirtualState(false)
  }
});


function LeftTrunPub() {
  if (Virtualstart==true){
    var speed = document.getElementById("powerRange").value;
    twist.linear.x = 0.0;
    twist.linear.y = 0.0;
    twist.angular.z = 1.0*speed;
    cmdVel.publish(twist);
  }
}

function RightTrunPub() {
  if (Virtualstart==true){
    var speed = document.getElementById("powerRange").value;
    twist.linear.x = 0.0;
    twist.linear.y = 0.0;
    twist.angular.z = -1.0*speed;
    cmdVel.publish(twist);
  }
}
function TrunOffPub() {
  if (Virtualstart==true){
    twist.linear.x = 0.0;
    twist.linear.y = 0.0;
    twist.angular.z = 0.0;
    cmdVel.publish(twist);
  }
}

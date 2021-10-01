var get_loc_bool = false;
var navStop_bool = false;
var saveYaml_bool = false;
var loadYaml_bool = false;

function gameStart() {
  if (document.getElementById("Game_start").checked) {
    myBoolean = Boolean(1);
  } else {
    myBoolean = Boolean(0);
  }
  var game_start = new ROSLIB.Message({
    data: myBoolean,
  });

  var request = new ROSLIB.ServiceRequest({
    config: {
      bools: [{ name: "Game_start", value: game_start.data }],
    },
  });
  dynamic_reconfigure_pub(request);
}

function resetLoc() {
  if (get_loc_bool == false) {
    myBoolean = Boolean(1);
  } else {
    myBoolean = Boolean(0);
  }
  var get_loc = new ROSLIB.Message({
    data: myBoolean,
  });

  var request = new ROSLIB.ServiceRequest({
    config: {
      bools: [{ name: "Reset_loc", value: get_loc.data }],
    },
  });
  dynamic_reconfigure_pub(request);
}

function getLoc() {
  if (get_loc_bool == false) {
    myBoolean = Boolean(1);
  } else {
    myBoolean = Boolean(0);
  }
  var get_loc = new ROSLIB.Message({
    data: myBoolean,
  });

  var request = new ROSLIB.ServiceRequest({
    config: {
      bools: [{ name: "Get_loc", value: get_loc.data }],
    },
  });
  dynamic_reconfigure_pub(request);
}

function navStart() {
  if (document.getElementById("Nav_start").checked) {
    myBoolean = Boolean(1);
  } else {
    myBoolean = Boolean(0);
  }
  var nav_start = new ROSLIB.Message({
    data: myBoolean,
  });

  var request = new ROSLIB.ServiceRequest({
    config: {
      bools: [{ name: "Nav_start", value: nav_start.data }],
    },
  });
  dynamic_reconfigure_pub(request);
}
function navStop() {
  if (navStop_bool == false) {
    myBoolean = Boolean(1);
  } else {
    myBoolean = Boolean(0);
  }
  var navStop = new ROSLIB.Message({
    data: myBoolean,
  });

  var request = new ROSLIB.ServiceRequest({
    config: {
      bools: [{ name: "Nav_stop", value: navStop.data }],
    },
  });
  dynamic_reconfigure_pub_stop(request);
}
function saveYaml() {
  if (saveYaml_bool == false) {
    myBoolean = Boolean(1);
  } else {
    myBoolean = Boolean(0);
  }
  var saveYaml = new ROSLIB.Message({
    data: myBoolean,
  });

  var request = new ROSLIB.ServiceRequest({
    config: {
      bools: [{ name: "SaveYaml", value: saveYaml.data }],
    },
  });
  dynamic_reconfigure_pub(request);
}
function loadYaml() {
  if (loadYaml_bool == false) {
    myBoolean = Boolean(1);
  } else {
    myBoolean = Boolean(0);
  }
  var loadYaml = new ROSLIB.Message({
    data: myBoolean,
  });

  var request = new ROSLIB.ServiceRequest({
    config: {
      bools: [{ name: "LoadYaml", value: loadYaml.data }],
    },
  });
  dynamic_reconfigure_pub(request);
}

function RobotMode() {
  var Robot_mode = new ROSLIB.Message({
    data: document.getElementById("Robot_mode").value,
  });
  var request = new ROSLIB.ServiceRequest({
    config: {
      strs: [{ name: "Robot_mode", value: Robot_mode.data }],
    },
  });
  dynamic_reconfigure_pub(request);
}

function Item1() {
  var Item = new ROSLIB.Message({
    data: document.getElementById("Item").value,
  });

  var request = new ROSLIB.ServiceRequest({
    config: {
      strs: [{ name: "Item", value: Item.data }],
    },
  });
  dynamic_reconfigure_pub(request);
}
function NavMode() {
  var Nav_mode = new ROSLIB.Message({
    data: document.getElementById("Nav_mode").value,
  });

  var request = new ROSLIB.ServiceRequest({
    config: {
      strs: [{ name: "Nav_mode", value: Nav_mode.data }],
    },
  });
  dynamic_reconfigure_pub(request);
}

function dynamic_reconfigure_pub(request) {
  var pub = new ROSLIB.Service({
    ros: ros,
    name: "/core/set_parameters",
    serviceType: "dynamic_reconfigure/Reconfigure",
  });

  pub.callService(request, function (result) {
    console.log("updating");
  });
}
function dynamic_reconfigure_pub_stop(request) {
  var pub = new ROSLIB.Service({
    ros: ros,
    name: "/stop/set_parameters",
    serviceType: "dynamic_reconfigure/Reconfigure",
  });

  pub.callService(request, function (result) {
    console.log("updating");
  });
}



function update_rqt() {
  var listener = new ROSLIB.Topic({
    ros: ros,
    name: "/core/parameter_updates",
    messageType: "dynamic_reconfigure/Config",
  });

  listener.subscribe(function (message) {
    for (var i = 0; i < message.strs.length; i++) {
      strs_update(message.strs[i].name, message.strs[i].value);
    }
    for (var i = 0; i < message.bools.length; i++) {
      bools_update(message.bools[i].name, message.bools[i].value);
      // console.log(message.bools[i].name+':'+message.bools[i].value);
    }
  });
}
function strs_update(MyList, MyItem) {
  $("#" + MyList + " option[value='" + MyItem + "']").prop("selected", true);
}
function bools_update(MyList, MyItem) {
  $("#" + MyList).prop("checked", MyItem);
  get_loc_bool = MyItem;
}
function test() {
  console.log("hi");
}
//======================================================================

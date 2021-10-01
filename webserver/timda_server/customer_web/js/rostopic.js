if (location.hostname == "") {
  location.hostname = "localhost";
}

var ros = new ROSLIB.Ros({
  url: "ws://" + location.hostname + ":9090",
});

ros.on("connection", function () {
  console.log("Connected to websocket server.");
  // alert("Connected to websocket server.");
});

ros.on("error", function (error) {
  console.log("Error connecting to websocket server: ", error);
  // alert("Error connecting to websocket server: ", error);
});

ros.on("close", function () {
  console.log("Connection to websocket server closed.");
  alert("Connection to websocket server closed.");

});

// Show rosbridge connection info
// -----------------

document.oncontextmenu = function () {
  return false;
}; // 防右鍵選單

var addTwoIntsClient = new ROSLIB.Service({
  ros: ros,
  name: '/customer_order',
  serviceType: 'diagnostic_msgs/AddDiagnostics'
});
function radio(name) {
  table_name = document.getElementsByName(name)
  for (var i = 0; i < table_name.length; i++) {
    if (table_name[i].checked) {
      return table_name[i].value;

    }
  }

}

table_name = document.getElementById("tables").value
var request = new ROSLIB.ServiceRequest({
  load_namespace: id + '+' + table_name
});

addTwoIntsClient.callService(request, function (result) {
  document.getElementById(id + '_print').style = "visibility: visible;"
  document.getElementById(id + '_print').innerHTML = result.message;
  setTimeout(function myFunction() {
    document.getElementById(id + '_print').style = "visibility: hidden;"
  }, 1000);

  console.log('Result for service call on '
    + addTwoIntsClient.name
    + ': '
    + result.success
    + result.message);
});

function pub_goods(id) {

  table_name = radio("group1")
  // console.log(table_name
  if (table_name == undefined) {
    alert("Please choose table");
    return;
  }
  var request = new ROSLIB.ServiceRequest({
    load_namespace: id + '+' + table_name
  });

  addTwoIntsClient.callService(request, function (result) {
    document.getElementById(id + '_print').style = "visibility: visible;"
    document.getElementById(id + '_print').innerHTML = result.message;
    setTimeout(function myFunction() {
      document.getElementById(id + '_print').style = "visibility: hidden;"
    }, 1000);

    console.log('Result for service call on '
      + addTwoIntsClient.name
      + ': '
      + result.success
      + result.message);
  });

}



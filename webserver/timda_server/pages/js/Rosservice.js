var get_loc_bool = false;

function gameStart() {
    if (document.getElementById("game_start").checked) {
        myBoolean = Boolean(1);
    } else {
        myBoolean = Boolean(0)
    }
    var game_start = new ROSLIB.Message({
        data: myBoolean
    });

    var request = new ROSLIB.ServiceRequest({
        config: {
            bools: [
                { name: 'game_start', value: game_start.data },

            ]

        }
    });
    dynamic_reconfigure_pub (request)
}

function getLoc() {
    if (get_loc_bool==false) {
        myBoolean = Boolean(1);
    } else {
        myBoolean = Boolean(0)
    }
    var get_loc = new ROSLIB.Message({
        data: myBoolean
    });

    var request = new ROSLIB.ServiceRequest({
        config: {
            bools: [
                { name: 'get_loc', value: get_loc.data },

            ]

        }
    });
    dynamic_reconfigure_pub(request)
}

function navStart() {
    if (document.getElementById("nav_start").checked) {
        myBoolean = Boolean(1);
    } else {
        myBoolean = Boolean(0)
    }
    var nav_start = new ROSLIB.Message({
        data: myBoolean
    });

    var request = new ROSLIB.ServiceRequest({
        config: {
            bools: [
                { name: 'nav_start', value: nav_start.data },

            ]

        }
    });
    dynamic_reconfigure_pub(request)
}

function RobotMode() {
    var Robot_mode = new ROSLIB.Message({
        data: document.getElementById("Robot_mode").value
    });
    var request = new ROSLIB.ServiceRequest({
        config: {
            strs: [
                { name: 'Robot_mode', value: Robot_mode.data },

            ]

        }
    });
    dynamic_reconfigure_pub(request)
}

function Item1() {
    var Item = new ROSLIB.Message({
        data: document.getElementById("Item").value
    });

    var request = new ROSLIB.ServiceRequest({
        config: {
            strs: [
                { name: 'Item', value: Item.data },

            ]

        }
    });
    dynamic_reconfigure_pub(request)
}
function NavMode() {
    var Nav_mode = new ROSLIB.Message({
        data: document.getElementById("Nav_mode").value
    });

    var request = new ROSLIB.ServiceRequest({
        config: {
            strs: [
                { name: 'Nav_mode', value: Nav_mode.data },

            ]

        }
    });
    dynamic_reconfigure_pub(request)
}




function dynamic_reconfigure_pub(request){
    var pub = new ROSLIB.Service({
        ros : ros,
        name : '/core/set_parameters',
        serviceType : 'dynamic_reconfigure/Reconfigure'
        });
    
        pub.callService(request, function(result) {
        console.log('updating');
        });

}

function update_rqt(){
    var listener = new ROSLIB.Topic({
        ros : ros,
        name : '/core/parameter_updates',
        messageType : 'dynamic_reconfigure/Config'
    });
    
    listener.subscribe(function(message) {
        for (var i = 0; i < message.strs.length; i++) {
            strs_update(message.strs[i].name,message.strs[i].value)
        }
        for (var i = 0; i < message.bools.length; i++) {
            bools_update(message.bools[i].name,message.bools[i].value)
            // console.log(message.bools[i].name+':'+message.bools[i].value);
        }
    
      });   
      
    }
    function strs_update(MyList,MyItem)  
    {   
        $("#"+MyList+" option[value='"+MyItem+"']").prop("selected",true);
    } 
    function bools_update(MyList,MyItem)  
    {   
        $("#"+MyList).prop("checked", MyItem);  
        get_loc_bool= MyItem

    } 

//======================================================================

var myBoolean1 = new Boolean();
var myBoolean2 = new Boolean();
var myBoolean3 = new Boolean();
var myBoolean4 = new Boolean();
var myBoolean5 = new Boolean();
var myBoolean6 = new Boolean();
var get_loc_bool = false;
//--------------------------------------------
// 即時更新數據
//--------------------------------------------


// var x;
// var y;
// function myrefresh() {
//     var maxVelX = new ROSLIB.Param({
//         ros: ros,
//         name: '/left_wheel_pid/Kd'
//     });

//     var maxVely = new ROSLIB.Param({
//         ros: ros,
//         name: '/left_wheel_pid/Kp'
//     });
//     var maxVelz = new ROSLIB.Param({
//         ros: ros,
//         name: '/left_wheel_pid/Ki'
//     });
//  maxVelX.set(0.8);
//     maxVelX.get(function (value) {
//         document.getElementById("demo").value = value;
//     });
//     maxVely.get(function (value) {
//         document.getElementById("demo2").value = value;
//         x = value

//         maxVelz.get(function (value) {
//             document.getElementById("demo3").value = value;
//         });
//     });
//     setTimeout(myrefresh, 10);
// }
// myrefresh()
// setTimeout('myrefresh()', 100); //指定1秒刷新一次
// --------------------------------------------
// --------------------------------------------

function processFormData() {
    if (document.getElementById("chase_straight").checked) {
        myBoolean2 = Boolean(1);
    } else {
        myBoolean2 = Boolean(0)
    }

    if (document.getElementById("Accelerate").checked) {
        myBoolean3 = Boolean(1);
    } else {
        myBoolean3 = Boolean(0)
    }
    if (document.getElementById("ball_pwm").checked) {
        myBoolean4 = Boolean(1);
    } else {
        myBoolean4 = Boolean(0)
    }
    if (document.getElementById("shooting_start").checked) {
        myBoolean5 = Boolean(1);
    } else {
        myBoolean5 = Boolean(0)
    }


    var chase_straight = new ROSLIB.Message({
        data: myBoolean2
    });
    var Accelerate = new ROSLIB.Message({
        data: myBoolean3
    });
    var ball_pwm = new ROSLIB.Message({
        data: myBoolean4
    });
    var shooting_start = new ROSLIB.Message({
        data: myBoolean5
    });




    var ballhandle_dis = new ROSLIB.Message({
        data: parseInt(document.getElementById("ballhandle_disInput").value)
    });
    var ballhandle_ang = new ROSLIB.Message({
        data: parseInt(document.getElementById("ballhandle_angInput").value)
    });



    var orb_attack_ang = new ROSLIB.Message({
        data: parseFloat(document.getElementById("orb_attack_angInput").value)
    });
    var atk_shoot_ang = new ROSLIB.Message({
        data: parseFloat(document.getElementById("atk_shoot_angInput").value)
    });
    var atk_shoot_dis = new ROSLIB.Message({
        data: parseFloat(document.getElementById("atk_shoot_disInput").value)
    });
    var minimum_w = new ROSLIB.Message({
        data: parseFloat(document.getElementById("minimum_wInput").value)
    });
    var maximum_w = new ROSLIB.Message({
        data: parseFloat(document.getElementById("maximum_wInput").value)
    });
    var minimum_v = new ROSLIB.Message({
        data: parseFloat(document.getElementById("minimum_vInput").value)
    });
    var maximum_v = new ROSLIB.Message({
        data: parseFloat(document.getElementById("maximum_vInput").value)
    });
    var run_x = new ROSLIB.Message({
        data: parseFloat(document.getElementById("run_xInput").value)
    });
    var run_y = new ROSLIB.Message({
        data: parseFloat(document.getElementById("run_yInput").value)
    });
    var run_yaw = new ROSLIB.Message({
        data: parseFloat(document.getElementById("run_yawInput").value)
    });

    var game_state = new ROSLIB.Message({
        data: document.getElementById("game_state").value
    });
    var strategy_mode = new ROSLIB.Message({
        data: document.getElementById("strategy_mode").value
    });
    var attack_mode = new ROSLIB.Message({
        data: document.getElementById("attack_mode").value
    });
    var our_side = new ROSLIB.Message({
        data: document.getElementById("our_side").value
    });
    var run_point = new ROSLIB.Message({
        data: document.getElementById("run_point").value
    });



    var request = new ROSLIB.ServiceRequest({
        config: {
            bools: [
                { name: 'game_start', value: game_start.data },
                { name: 'chase_straight', value: chase_straight.data },
                { name: 'Accelerate', value: Accelerate.data },
                { name: 'ball_pwm', value: ball_pwm.data },
                { name: 'shooting_start', value: shooting_start.data },
                //{name: 'change_plan', value: change_plan.data},
            ],
            ints: [
                { name: 'ballhandle_dis', value: ballhandle_dis.data },
                { name: 'ballhandle_ang', value: ballhandle_ang.data },
            ],
            strs: [
                { name: 'game_state', value: game_state.data },
                { name: 'strategy_mode', value: strategy_mode.data },
                { name: 'attack_mode', value: attack_mode.data },
                { name: 'our_side', value: our_side.data },
                { name: 'run_point', value: run_point.data },
            ],
            doubles: [
                { name: 'orb_attack_ang', value: orb_attack_ang.data },
                { name: 'atk_shoot_ang', value: atk_shoot_ang.data },
                { name: 'atk_shoot_dis', value: atk_shoot_dis.data },
                { name: 'minimum_w', value: minimum_w.data },
                { name: 'minimum_w', value: minimum_w.data },
                { name: 'maximum_w', value: maximum_w.data },
                { name: 'minimum_v', value: minimum_v.data },
                { name: 'maximum_v', value: maximum_v.data },
                { name: 'run_x', value: run_x.data },
                { name: 'run_y', value: run_y.data },
                { name: 'run_yaw', value: run_yaw.data },
            ],
            groups: [
                // {name: '', state: false, id: 0, parent: 0}
            ]
        }

    });

    dynaRecClient.callService(request, function (result) {
        console.log('Result for service call on '
            + dynaRecClient.name
            + ': '
            + JSON.stringify(result, null, 2));
    });

}

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
    pub(request)
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
    pub(request)
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
    pub(request)
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
    pub(request)
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
    pub(request)
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
    pub(request)
}




function pub(request){
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

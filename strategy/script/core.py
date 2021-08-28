#!/usr/bin/env python
from yaml import serialize
import rospy
import sys
import math
import time
from robot.robot import Robot
from my_sys import log, SysCheck, logInOne
from dynamic_reconfigure.server import Server as DynamicReconfigureServer
from strategy.cfg import RobotConfig
import dynamic_reconfigure.client
from std_msgs.msg import String
from std_msgs.msg import Int32
from diagnostic_msgs.srv import AddDiagnostics, AddDiagnosticsResponse
import itertools
# from navigation_tool.calculate_path_distance import Nav_cal
from strategy.srv import TimdaMode, TimdaModeResponse
from strategy.srv import aruco_relative_pose, aruco_relative_poseResponse
from strategy.msg import TimdaMobileStatus
ADJUST = "Timda_mobile_relative_pose"
TIMDA_SERVER = "Timda_mobile"
CUSTOMER = "customer_order"
TIMDA_STATUS = "timda_mobile_status"

class Core(Robot):
    def Callback(self, config, level):
        self.game_start = config['game_start']
        self.get_loc = config['get_loc']
        self.mode = config['Robot_mode']
        self.item = config['Item']
        self.nav_mode = config['Nav_mode']
        self.nav_start = config['nav_start']
        self.loc_reset = config['reset_loc']

        return config

    def __init__(self, sim=False):
        super(Core, self).__init__(sim)
        self.initial_point = self.loc

        dsrv = DynamicReconfigureServer(RobotConfig, self.Callback)


class Strategy(object):

    def __init__(self, sim=False):
        rospy.init_node('core', anonymous=False)
        self.rate = rospy.Rate(200)
        self.robot = Core(sim)
        self.dclient = dynamic_reconfigure.client.Client(
            "core", timeout=30, config_callback=None)
        self.dclient.update_configuration(
            {"game_start": False})
        self.cal_list = []
        self.tableNum = []
        self.service_list = []
        # rospy.Subscriber("wifi_test", Int32, self._getTableNum)
        # rospy.Service(WIFI_BUTTON, wifi_srv, self._getTableNum)
        rospy.Service(TIMDA_SERVER, TimdaMode, self.handle_timda_mobile)
        rospy.Service(ADJUST, aruco_relative_pose, self.adjust_timda)
        rospy.Service(CUSTOMER, AddDiagnostics, self.web_customer)
        self.publish_status = self.robot._Publisher(TIMDA_STATUS,  TimdaMobileStatus)


        self.main()

#--------------------------------------------------------------------------------------------------------#
# main Strategy
#--------------------------------------------------------------------------------------------------------#
    def main(self):
        while not rospy.is_shutdown():
            if self.robot.game_start == True:
                if self.robot.mode == "Navigating":
                    while self.robot.nav_start == True:
                        if self.robot.nav_mode == "test":
                            j = 1
                            for i in self.robot.item_dict:
                                print("going to the number", j, "goal")
                                a = self.robot.goal_client(i)
                                print(a)
                                j = j + 1
                                while 1:
                                    if self.robot.status[0].status == 3:
                                        print("Nav stop")
                                        break
                            self.dclient.update_configuration(
                                {"nav_start": "False"})
                        elif self.robot.nav_mode == "directory":
                            a = self.robot.goal_client(self.robot.item)
                            print(a)
                            while 1:
                                if self.robot.status[0].status == 3:
                                    print("Nav stop")
                                    break
                            self.dclient.update_configuration(
                                {"nav_start": "False"})
                elif self.robot.mode == "Setting":
                    if self.robot.get_loc == True:
                        print("it is setting", self.robot.item, "position")
                        self.robot.recordPosition(self.robot.item)
                        self.dclient.update_configuration({"get_loc": "False"})
                    elif self.robot.loc_reset == True:
                        print("it is reset", self.robot.item, "location")
                        self.robot.resetLocation(self.robot.item)
                        self.dclient.update_configuration({"reset_loc": "False"})
                    
#--------------------------------------------------------------------------------------------------------#
# Service function
#--------------------------------------------------------------------------------------------------------#

    def adjust_timda(self, req):
        res = aruco_relative_poseResponse()
        if self.robot.mode == "Service":
            print("Client Request to move to (x_length, y_length, theta) =\
                     {}, {}, {} relative to current pose".format(req.x_length, req.y_length, req.theta))

            # Server RESPONSE
            loc = self.robot.loc
            # var_x = (req.x_length/0.2)*req.x_length
            # var_y = (req.y_length/0.22)*req.y_length
            var_x = req.x_length
            var_y = req.y_length
            varo = 0.27
            lim_r = 0.1
            lim_v = 0.1
            print("X adjusting start")
            while 1:
                dis_x = (loc.pose.pose.position.x - var_x) - \
                    self.robot.loc.pose.pose.position.x
                print(dis_x)
                if abs(dis_x) < lim_r:
                    self.robot.RobotCtrlS(0, 0, 0)
                    print("X_adjusting Stop")
                    break
                self.robot.RobotCtrlS(lim_v * dis_x/abs(dis_x), 0, 0)
            print("Y adjusting start")
            while 1:
                print(dis_y)
                dis_y = (loc.pose.pose.position.y - var_y) - \
                    self.robot.loc.pose.pose.position.y
                self.robot.RobotCtrlS(0, lim_v * dis_y/abs(dis_y), 0)
                if abs(dis_y) < lim_r:
                    self.robot.RobotCtrlS(0, 0, 0)
                    print("y_adjusting Stop")
                    break
                self.robot.RobotCtrlS(0, lim_v * dis_y/abs(dis_y), 0)
            print("Adjusting Stop")

            res.nav_done_res = "finish"
            print('res.nav_done = ', res.nav_done_res)
        else:
            print(req)
            res.nav_done_res = "closed"
        return res


    def handle_timda_mobile(self, req):
        res = TimdaModeResponse()
        if self.robot.mode == "Service":
            item_key = list(self.robot.item_dict.keys())

            if item_key.count(req.item_req) > 0:
                self.dclient.update_configuration({"Item": req.item_req})
                self.dclient.update_configuration({"nav_start": "True"})
                while self.robot.nav_start == True:
                    a = self.robot.goal_client(req.item_req)
                    print(a)
                    while 1:
                        if self.robot.status[0].status == 3:
                            print("Nav Stop")
                            break
                    self.dclient.update_configuration(
                        {"nav_start": "False"})
                print(req.item_req, "Reached!")
                res.nav_res = 'finish'
            elif self.robot.item_adjust.count(req.item_req) > 0:
                loc = self.robot.loc
                var = 0.2
                varo = 0.27
                lim_r = 0.1
                lim_v = 0.1
                while 1:
                    if "back" in req.item_req:
                        dis_x = (loc.pose.pose.position.x - var) - \
                            self.robot.loc.pose.pose.position.x
                        dis_y = 0
                        if abs(dis_x) < lim_r:
                            self.robot.RobotCtrlS(0, 0, 0)
                            res.nav_res = 'finish'
                            print("Move Stop")
                            break
                        self.robot.RobotCtrlS(lim_v * -1, 0, 0)
                    elif "front" in req.item_req:
                        dis_x = (loc.pose.pose.position.x + var) - \
                            self.robot.loc.pose.pose.position.x
                        dis_y = 0
                        if abs(dis_x) < lim_r:
                            self.robot.RobotCtrlS(0, 0, 0)
                            res.nav_res = 'finish'
                            break
                        self.robot.RobotCtrlS(lim_v, 0, 0)
                    elif "left" in req.item_req:
                        dis_x = 0
                        dis_y = (loc.pose.pose.position.y + varo) - \
                            self.robot.loc.pose.pose.position.y
                        if abs(dis_y) < lim_r:
                            self.robot.RobotCtrlS(0, 0, 0)
                            res.nav_res = 'finish'
                            break
                        self.robot.RobotCtrlS(0, lim_v, 0)
                    elif "right" in req.item_req:
                        dis_x = 0
                        dis_y = (loc.pose.pose.position.y - varo) - \
                            self.robot.loc.pose.pose.position.y

                        if abs(dis_y) < lim_r:
                            self.robot.RobotCtrlS(0, 0, 0)
                            res.nav_res = 'finish'
                            break
                        self.robot.RobotCtrlS(0, lim_v * -1, 0)

                print("Move Stop")
        else:
            print(req)
            res.nav_res = 'finish'
        return res

    def web_customer(self, req):
        res = AddDiagnosticsResponse()
        self.publish_status.publish(req.load_namespace) 
        res.message = "Receive Order, Please Wait a minute"
        return res

if __name__ == '__main__':
    try:
        if SysCheck(sys.argv[1:]) == "Native Mode":
            log("Start Native")
            s = Strategy(False)
        elif SysCheck(sys.argv[1:]) == "Simulative Mode":
            log("Start Sim")
            s = Strategy(True)
            # Initializes a rospy node so that the SimpleActionClient can
            # publish and subscribe over ROS.
            # print "Result:", ', '.join([str(n) for n in result.sequence])
    except rospy.ROSInterruptException:
        print("program interrupted before completion")
        pass

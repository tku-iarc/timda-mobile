#!/usr/bin/env python3
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
from navigation_tools.calculate_path_distance import Nav_cal


class Core(Robot):
    def Callback(self, config, level):
        self.game_start = config['game_start']
        self.get_loc = config['get_loc']
        self.mode = config['Robot_mode']
        return config

    def __init__(self, sim=False):
        super(Core, self).__init__(sim)
        dsrv = DynamicReconfigureServer(RobotConfig, self.Callback)
        self.mode = "Setting"


class Strategy(object):

    def __init__(self, sim=False):
        rospy.init_node('core', anonymous=False)
        self.rate = rospy.Rate(200)
        self.robot = Core(sim)
        self.dclient = dynamic_reconfigure.client.Client(
            "core", timeout=30, config_callback=None)

        self.main()

    def main(self):
        while not rospy.is_shutdown():
            if self.robot.game_start == True:
                if self.robot.mode == "Navigating":
                    j = 1
                    for i in self.robot.poslist:
                        print("going to the number", j, "goal")
                        self.robot.goal_client(i)
                        j = j + 1
                        while 1:
                            if self.robot.status[0].status == 3:
                                print("Nav stop")
                                break
                    self.dclient.update_configuration(
                        {"Robot_mode": "Setting"})
                elif self.robot.get_loc == True:
                    self.robot.loc_pub.publish(1)
                    print("goal size is:", len(self.robot.poslist)+1)
                    self.dclient.update_configuration({"get_loc": "False"})
            # else:
                # log("Sleeping")


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

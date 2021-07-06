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
import itertools
from navigation_tool.calculate_path_distance import Nav_cal


class Core(Robot):
    def Callback(self, config, level):
        self.game_start = config['game_start']
        self.get_loc = config['get_loc']
        self.mode = config['Robot_mode']
        self.item = config['Item']
        self.nav_mode = config['Nav_mode']
        self.nav_start = config['nav_start']
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

        self.main()

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
                elif self.robot.mode == "Calculating":
                    self.cal_tmp2 = [1, 2, 3]
                    self.route_dict = {}
                    self.robot.Calculate(True)
                    self.robot.recordPosition("Current")
                    self.cal_list = self.robot.GetCal_list()
                    self.cal_tmp = list(itertools.permutations(
                        self.cal_list, len(self.cal_list)))
                    self.cal_tmp2 = list(itertools.permutations(
                        self.cal_tmp2, len(self.cal_tmp2)))
                    jj = 0
                    for i in self.cal_tmp:
                        start = self.robot.initial_point
                        dis_tmp = 0.0
                        str1 = ','.join(str(i) for i in self.cal_tmp2[jj])
                        kk = 1
                        for j in i:
                            end = j
                            self.path = self.robot.setting_path_point(
                                str1, kk, start, end)
                            rospy.sleep(1)
                            self.path = self.robot.GetPath()
                            dis_tmp = dis_tmp + self.robot.PrintPath(self.path)
                            print("Distance:", dis_tmp)
                            start = end
                            kk = kk + 1
                        self.route_dict[str1] = dis_tmp
                        jj = jj + 1
                    self.robot.Calculate(False)

                    print(self.route_dict)
                    self.dclient.update_configuration(
                        {"Robot_mode": "idle"})


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

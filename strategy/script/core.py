#!/usr/bin/env python
import rospy
import sys
import math
import time
from robot.robot import Robot
from my_sys import log, SysCheck, logInOne
from dynamic_reconfigure.server import Server as DynamicReconfigureServer
from strategy.cfg import RobotConfig


# class Core(Robot):
#     def __init__(self, sim=False):
#         super(Core, self).__init__(sim)


class Strategy(Robot):
    def Callback(self, config, level):
        self.game_start = config['game_start']
        return config

    def __init__(self, sim=False):
        super(Strategy, self).__init__(sim)
        rospy.init_node('core', anonymous=True)
        srv = DynamicReconfigureServer(RobotConfig, self.Callback)
        self.rate = rospy.Rate(200)
        # self.robot = Core(sim)
        self.main()

    def main(self):
        while not rospy.is_shutdown():
            # b = self.Getlocation(1)
            # print(b)
            # a = self.goal_client()
            # print(a)
            if self.game_start == True:
                if self.mode == "navagating":
                    for i in self.poslist:
                        a = self.goal_client(i)
                        print(a)
                        while 1:
                            if self.status == 3:
                                break

                    self.mode = "setting"

                else:
                    print(self.status)
            else:
                log("Sleeping")


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

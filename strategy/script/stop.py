#!/usr/bin/env python
import rospy
from robot.robot import Robot
from strategy.cfg import RobotConfig
from dynamic_reconfigure.server import Server as DynamicReconfigureServer
import dynamic_reconfigure.client
from actionlib_msgs.msg import GoalID


class Stop_Core(Robot):

    def Callback(self, config, level):
        self.nav_cancel = config['Nav_stop']

        return config

    def __init__(self, sim=False):
        super(Stop_Core, self).__init__(sim)
        dsrv = DynamicReconfigureServer(RobotConfig, self.Callback)


class Stop():
    def __init__(self, sim=False):
        rospy.init_node('stop', anonymous=False)
        self.rate = rospy.Rate(200)
        self.stop_core = Stop_Core(sim)
        self.stop = GoalID()
        self.dclient = dynamic_reconfigure.client.Client(
            "stop", timeout=30, config_callback=None)
        self.dclient.update_configuration({"Nav_stop": "False"})
        self.main()

    def main(self):
        while not rospy.is_shutdown():
            if self.stop_core.nav_cancel == True:
                self.stop_core.pub_stopNav.publish(self.stop)
                print("Stop navigation")
                self.dclient.update_configuration({"Nav_stop": "False"})


if __name__ == '__main__':
    try:
        s = Stop(False)
    except rospy.ROSInterruptException:
        print("program interrupted before completion")
        pass

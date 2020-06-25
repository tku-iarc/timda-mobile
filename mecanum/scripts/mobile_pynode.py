#!/usr/bin/env python
from mecanum.mecanum import Mecanum
import rospy
from geometry_msgs.msg import Twist

class Mobile(object):
    def __init__(self):
        print("Initialized mobile_node.py...")
        rospy.init_node('mobile_node', anonymous=False)
        self.mecanum = Mecanum(0.48544, 0.253, 0.1524) ## a: 0.48544, b: 0.253, R: 0.1524)
        rospy.Subscriber("mobile/cmd_vel", Twist, self.callback)
        self.rate = rospy.Rate(1000)
        self.main()

    def callback(self, data):
        w1, w2, w3, w4 = self.mecanum.ik(data.linear.x, \
                                         data.linear.y, \
                                         data.angular.z)
        # print(w1,w2,w3,w4)

    def main(self):
        print('OK')
        while not rospy.is_shutdown():

            if rospy.is_shutdown():
                break

            self.rate.sleep()

if __name__ == '__main__':
    try:
        m = Mobile()
    except rospy.ROSInterruptException:
        pass

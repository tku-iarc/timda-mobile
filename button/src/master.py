#!/usr/bin/env python
# To recieve what table has been select
import rospy
from button.srv import wifi_srv


def fun1(req):
    print('req is : {}'.format(req.num_req))
    return ["finish!"]


def main():
    rospy.init_node('server_wifi', anonymous=True)
    rospy.Service('wifi_module', wifi_srv, fun1)
    rospy.spin()


if __name__ == '__main__':
    main()

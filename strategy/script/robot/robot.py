#!/usr/bin/env python3

import actionlib
import rospy
import sys
import roslib
from move_base_msgs.msg import MoveBaseAction
from move_base_msgs.msg import MoveBaseGoal
from geometry_msgs.msg import PoseWithCovarianceStamped
from std_msgs.msg import Int32
from actionlib_msgs.msg import GoalStatusArray
roslib.load_manifest('move_base')

# Brings in the SimpleActionClient

# Brings in the messages used by the fibonacci action, including the
# goal message and the result message.


POS_RECORD_TOPIC = "pos_record"


class Robot(object):

    def __init__(self, sim=False):
        rospy.Subscriber(
            "amcl_pose", PoseWithCovarianceStamped, self._getPosition)
        rospy.Subscriber("pos_record", Int32, self._RecordPosition)
        rospy.Subscriber("move_base/status", GoalStatusArray, self._getstatus)
        self.poslist = []
        self.status = []  # waiting
        self.loc_pub = self._Publisher(POS_RECORD_TOPIC, Int32)

    def goal_client(self, goal):
        # Creates the SimpleActionClient, passing the type of the action
        # (FibonacciAction) to the constructor.
        self.client = actionlib.SimpleActionClient('move_base', MoveBaseAction)
        # Waits until the action server has started up and started
        # listening for goals.
        self.client.wait_for_server()

        # Creates a goal to send to the action server.
        self.goal = MoveBaseGoal()
        self.goal.target_pose.header.frame_id = "map"
        self.goal.target_pose.header.stamp = rospy.get_rostime()
        self.goal.target_pose.pose.position.x = goal.pose.pose.position.x
        self.goal.target_pose.pose.position.y = goal.pose.pose.position.y
        self.goal.target_pose.pose.orientation.z = 1
        self.goal.target_pose.pose.orientation.w = 0.016

        # Sends the goal to the action server.
        rospy.loginfo("Sending goal")
        self.client.send_goal(self.goal)

        # Waits for the server to finish performing the action.
        self.client.wait_for_result()

        # Prints out the result of executing the action
        return self.client.get_result()  # A FibonacciResult

    def _Publisher(self, topic, mtype):
        return rospy.Publisher(topic, mtype, queue_size=10)

    def _getPosition(self, pos):
        self.loc = pos
        # print(self.loc)

    def _RecordPosition(self, cmd):
        if cmd.data == 1:
            self.poslist.append(self.loc)
            print("Record done")

    def _getstatus(self, mobilestatus):
        self.status = mobilestatus.status_list
        # print(mobilestatus.status_list)

    def Getstatus(self):
        return self.status

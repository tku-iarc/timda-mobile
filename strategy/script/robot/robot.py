#!/usr/bin/env python3

import os
from actionlib_msgs.msg import GoalID
from move_base_msgs.msg import MoveBaseActionGoal
from geometry_msgs.msg import PoseStamped
from nav_msgs.msg import Path
import math
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
PATH_CALCULATE_TOPIC = ""
GOAL_TOPIC = "move_base_simple/goal"
INITIALPOSE_TOPIC = "initialpose"
GOAL_STOP_TOPIC = "move_base/cancel"
subscriber = None


class Robot(object):

    def __init__(self, sim=False):
        rospy.Subscriber(
            "amcl_pose", PoseWithCovarianceStamped, self._getPosition)
        rospy.Subscriber("move_base/status", GoalStatusArray, self._getstatus)
        self.path_subscriber = rospy.Subscriber(
            "move_base/NavfnROS/plan", Path, self._getPath)
        # self.subscriber = rospy.Subscriber(
        #     PATH_CALCULATE_TOPIC, Path, self.printPath)
        self.calculate_path = False
        self.initial_point = PoseWithCovarianceStamped()
        self.status = []  # waiting
        self.item_dict = {}
        self.path = Path()
        self.pub_goal = self._Publisher(GOAL_TOPIC, PoseStamped)
        self.pub_initial_point = self._Publisher(
            INITIALPOSE_TOPIC, PoseWithCovarianceStamped)
        self.pub_stopNav = self._Publisher(GOAL_STOP_TOPIC, GoalID)

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
        self.goal.target_pose.pose.position.x = self.item_dict[goal].pose.pose.position.x
        self.goal.target_pose.pose.position.y = self.item_dict[goal].pose.pose.position.y
        self.goal.target_pose.pose.orientation.z = self.item_dict[goal].pose.pose.orientation.z
        self.goal.target_pose.pose.orientation.w = self.item_dict[goal].pose.pose.orientation.w

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

    def _getPath(self, path):
        if self.calculate_path == True:
            self.path = path
            self.pub_initial_point.publish(self.initial_point)
            self.pub_stopNav.publish(GoalID())
            self.path_subscriber.unregister()
            self.calculate_path = False
        else:
            pass

    def GetPath(self):
        return self.path

    def recordPosition(self, name, cmd):
        if cmd == 1:
            self.item_dict[name] = self.loc
            print("Record done")
        elif cmd == 2:
            self.initial_point = self.loc
            print("initial point get")
            self.calculate_path = True

    def _getstatus(self, mobilestatus):
        self.status = mobilestatus.status_list
        # print(mobilestatus.status_list)

    def Getstatus(self):
        return self.status

    def setting_path_point(self, start_point, goal_point):
        self.start_point = PoseWithCovarianceStamped()
        self.start_point.pose.pose.position.x = start_point.pose.pose.position.x
        self.start_point.pose.pose.position.y = start_point.pose.pose.position.y
        self.start_point.header.stamp = rospy.Time.now()
        self.start_point.pose.pose.orientation.z = start_point.pose.pose.orientation.z
        self.start_point.pose.pose.orientation.w = start_point.pose.pose.orientation.w
        self.start_point.header.frame_id = 'map'
        rospy.sleep(1)
        self.pub_initial_point.publish(self.start_point)
        print("Start Point sends sucessfull ")
        print("--------------------")
        self.goal_point = PoseStamped()
        self.goal_point.pose.position.x = goal_point.pose.pose.position.x
        self.goal_point.pose.position.y = goal_point.pose.pose.position.y
        self.goal_point.header.stamp = rospy.Time.now()
        self.goal_point.pose.orientation.z = goal_point.pose.pose.orientation.z
        self.goal_point.pose.orientation.w = goal_point.pose.pose.orientation.w
        self.goal_point.header.frame_id = 'map'
        rospy.sleep(2)
        self.pub_goal.publish(self.goal_point)
        print("Goal Point sends sucessfull")
        print("--------------------")
        print("Listening to " + GOAL_TOPIC)
        # rospy.spin()

    def PrintPath(self, path):
        # global subscriber
        first_time = True
        prev_x = 0.0
        prev_y = 0.0
        total_distance = 0.0
        if len(path.poses) > 0:
            # if str(sys.argv[3]) == '0':
            #     pub_stop = rospy.Publisher(
            #         'move_base/cancel', GoalID, queue_size=10)
            #     rospy.sleep(1)
            #     pub_stop.publish(GoalID())
            for current_point in path.poses:
                x = current_point.pose.position.x
                y = current_point.pose.position.y
                if not first_time:
                    total_distance += math.hypot(prev_x - x, prev_y - y)
                else:
                    first_time = False
                prev_x = x
                prev_y = y
            print("Total Distance = "+str(total_distance)+" meters")

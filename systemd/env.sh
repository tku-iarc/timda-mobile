#!/bin/sh
## Move this file to /etc/ros/env.sh
export ROS_HOSTNAME=$(hostname).localexport ROS_MASTER_URI=http://$ROS_HOSTNAME:11311
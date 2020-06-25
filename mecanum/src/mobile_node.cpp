#include "ros/ros.h"
#include "geometry_msgs/Twist.h"
#include <iostream>
#include "mecanum.cpp"

double a = 0.48544;
double b = 0.253;
double R = 0.1524;

class TimdaMobile
{
    ros::NodeHandle nh_;
    ros::Subscriber sub_;
    Mecanum *M;

public:
    TimdaMobile() {
        sub_ = nh_.subscribe("/mobile/cmd_vel", 1, &TimdaMobile::Callback, this);
        M = new Mecanum(a, b, R);
    }

    ~TimdaMobile() {
    }

    void Callback(const geometry_msgs::TwistConstPtr& msg) {
        std::cout<<msg->linear.x<<std::endl;
        std::cout<<msg->linear.y<<std::endl;
        std::cout<<msg->angular.z<<std::endl;
        M->IK(msg->linear.x,
             msg->linear.y,
             msg->angular.z);
    }
};

int main(int argc, char **argv)
{
  ros::init(argc, argv, "mobile_node");
  TimdaMobile tm;

  ros::spin();

  return 0;
}

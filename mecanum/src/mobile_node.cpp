#include "ros/ros.h"
#include "geometry_msgs/Twist.h"
#include <iostream>
#include <Mecanum/Mecanum.h>
#include <TimdaModbus/TimdaModbus.h>
#define K 0.10472

class TimdaMobile
{
    ros::NodeHandle nh_;
    ros::Subscriber sub_;
    Mecanum *M;
    TimdaModbus *TM;
    double a = 0.48544;
    double b = 0.253;
    double R = 0.1524;


public:
    TimdaMobile() {
        sub_ = nh_.subscribe("/mobile/cmd_vel", 1, &TimdaMobile::Callback, this);
        M = new Mecanum(this->a, this->b, this->R);
        TM = new TimdaModbus();
    }

    ~TimdaMobile() {
        delete M;
        delete TM;
    }

    void Callback(const geometry_msgs::TwistConstPtr& msg) {
        std::vector<double> W(4, 0);
        W = M->IK(msg->linear.x,
                  msg->linear.y,
                  msg->angular.z);
        //std::cout<<"Return from IK:"<<W.at(0)<<" "
        //                            <<W.at(1)<<" "
        //                            <<W.at(2)<<" "
        //                            <<W.at(3)<<std::endl;
        //this->TM->move(W.at(0), W.at(1), W.at(2), W.at(3));
        this->TM->move(W2RPM(W.at(0)), W2RPM(W.at(1)), W2RPM(W.at(2)), W2RPM(W.at(3)));
        std::cout<<"PWM: "<<W2RPM(W.at(0)) <<" "<< W2RPM(W.at(1))<<" "<< W2RPM(W.at(2))<<" "<< W2RPM(W.at(3))<<std::endl;
    }

    int W2RPM(double W) {
        double v = W * this->R;
        int RPM = (int)((v / this->R)/K);
        return RPM;
    }
};

int main(int argc, char **argv)
{
  ros::init(argc, argv, "mobile_node");
  TimdaMobile tm;

  ros::spin();

  return 0;
}

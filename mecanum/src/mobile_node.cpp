#include <ros/ros.h>
#include <geometry_msgs/Twist.h>
#include <iostream>
#include <iterator>
#include <Mecanum/Mecanum.h>
#include <TimdaModbus/TimdaModbus.h>
#include <tf/transform_broadcaster.h>
#include <nav_msgs/Odometry.h>
#include <pthread.h>
#define K 0.10472                 // 2 * pi / 60
#define MAX_RPM 3979
#define MIN_RPM 83

typedef void * (*THREADFUNCPTR)(void *);

template <typename T> int sgn(T val) {
    return (T(0) < val) - (val < T(0));
}

class TimdaMobile
{
    ros::NodeHandle nh_;
    ros::Subscriber sub_;
    ros::Publisher odom_pub;
    tf::TransformBroadcaster odom_broadcaster;
    ros::Rate *loop_rate;
    pthread_t t;
    Mecanum *M;
    TimdaModbus *TM;
    double a = 0.48544;
    double b = 0.253;
    double R = 0.1524;

private:
    double RPM;

public:
    TimdaMobile()
    {
        sub_ = nh_.subscribe("mobile/cmd_vel", 1, &TimdaMobile::Callback, this);
        odom_pub = nh_.advertise<nav_msgs::Odometry>("odom", 50);
        loop_rate = new ros::Rate(10);
        // if (pthread_create(&t, NULL, (THREADFUNCPTR)&TimdaMobile::Looper, this)) {
        //     printf("node thread error\n");
        //     exit(EXIT_FAILURE);
        // }

        M = new Mecanum(this->a, this->b, this->R);
        TM = new TimdaModbus();

        Looper();
    }

    ~TimdaMobile()
    {
        delete M;
        delete TM;
        delete loop_rate;
    }

    void Looper()
    {
        while (ros::ok()) {
            std::vector<int> MRPM(4, 0);
            std::vector<double> V(3, 0);
            MRPM = TM->read_motor_rpm();
            // std::cout<<"Motor's RPM:"<<MRPM.at(0)<<" "
            //                                             <<MRPM.at(1)<<" "
            //                                             <<MRPM.at(2)<<" "
            //                                             <<MRPM.at(3)<<std::endl;
            V = M->FK(RPM2W(MRPM.at(0)), RPM2W(MRPM.at(1))*-1,
                                 RPM2W(MRPM.at(2)), RPM2W(MRPM.at(3))*-1);
            // std::cout<<"Robot's Speed:"<<V.at(0)<<" "
            //                                               <<V.at(1)<<" "
            //                                               <<V.at(2)<<std::endl;
            ros::spinOnce();
            loop_rate->sleep();
        }
    }

    void Callback(const geometry_msgs::TwistConstPtr& msg)
    {
        std::vector<double> W(4, 0);
        W = M->IK(msg->linear.x,
                             msg->linear.y,
                             msg->angular.z);
        // std::cout<<"Return from IK:"<<W.at(0)<<" "
        //                            <<W.at(1)<<" "
        //                            <<W.at(2)<<" "
        //                            <<W.at(3)<<std::endl;
        this->TM->move(W2RPM(W.at(0)), W2RPM(W.at(1)), W2RPM(W.at(2)), W2RPM(W.at(3)));
        // std::cout<<"PWM: "<<W2RPM(W.at(0)) <<" "
        //                                  << W2RPM(W.at(1))<<" "
        //                                  << W2RPM(W.at(2))<<" "
        //                                  << W2RPM(W.at(3))<<std::endl;
    }

    int W2RPM(double W)
    {
        double v = W * this->R;
        RPM = (v / this->R)/K;
        // RPM = (abs(RPM) > MAX_RPM) ? MAX_RPM*sgn(RPM) : RPM;
        // RPM = (abs(RPM) < MIN_RPM) ? 0 : RPM;
        // return (int)RPM;
        /* Re-Mapping Range */
        double slope = 1.0 * (MAX_RPM - MIN_RPM) / (4627 - 0);
        double output = MIN_RPM + slope * abs(RPM);
        return (int)output * sgn(RPM);
    }

    double RPM2W(int RPM)
    {
        return K*RPM;
    }
};

int main(int argc, char **argv)
{
  ros::init(argc, argv, "mobile_node");
  TimdaMobile tm;

//   ros::spin();

  return 0;
}

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
    ros::Time current_time, last_time;
    pthread_t t;
    Mecanum *M;
    TimdaModbus *TM;
    double a = 0.24145;
    double b = 0.253;
    double R = 0.15098;
    double rx = 0.0;
    double ry = 0.0;
    double rz = 0.0;

private:
    double RPM;

public:
    TimdaMobile()
    {
        sub_ = nh_.subscribe("mobile/cmd_vel", 1, &TimdaMobile::Callback, this);
        odom_pub = nh_.advertise<nav_msgs::Odometry>("odom", 50);
        loop_rate = new ros::Rate(1000);
        current_time = ros::Time::now();
        last_time = ros::Time::now();

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
            //                          <<MRPM.at(1)<<" "
            //                          <<MRPM.at(2)<<" "
            //                          <<MRPM.at(3)<<std::endl;
            V = M->FK(RPM2W(MRPM.at(0)), RPM2W(MRPM.at(1))*-1,
                      RPM2W(MRPM.at(2)), RPM2W(MRPM.at(3))*-1);
            // std::cout<<"Robot's Speed:"<<V.at(0)<<" "
            //                            <<V.at(1)<<" "
            //                            <<V.at(2)<<std::endl;
            current_time = ros::Time::now();
            double dt = (current_time - last_time).toSec();
            double delta_x = (V.at(0)*cos(rz) - V.at(1)*sin(rz)) * dt;
            double delta_y = (V.at(0)*sin(rz) + V.at(1)*cos(rz)) * dt;
            double delta_th = V.at(2)* dt;

            rx += delta_x;
            ry += delta_y;
            rz += delta_th;
            // std::cout<<"Robot's Position: "<<rx<<" "
            //                                <<ry<<" "
            //                                <<rz<<" "
            //                                <<rz*(180.0/M_PI)<<std::endl;

            //since all odometry is 6DOF we'll need a quaternion created from yaw
            geometry_msgs::Quaternion odom_quat = tf::createQuaternionMsgFromYaw(rz);

            //first, we'll publish the transform over tf
            geometry_msgs::TransformStamped odom_trans;
            odom_trans.header.stamp = current_time;
            odom_trans.header.frame_id = "odom";
            odom_trans.child_frame_id = "base_link";

            odom_trans.transform.translation.x = rx;
            odom_trans.transform.translation.y = ry;
            odom_trans.transform.translation.z = 0.0;
            odom_trans.transform.rotation = odom_quat;

            //send the transform
            odom_broadcaster.sendTransform(odom_trans);

            //next, we'll publish the odometry message over ROS
            nav_msgs::Odometry odom;
            odom.header.stamp = current_time;
            odom.header.frame_id = "odom";

            //set the position
            odom.pose.pose.position.x = rx;
            odom.pose.pose.position.y = ry;
            odom.pose.pose.position.z = 0.0;
            odom.pose.pose.orientation = odom_quat;

            //set the velocity
            odom.child_frame_id = "base_link";
            odom.twist.twist.linear.x = V.at(0);
            odom.twist.twist.linear.y = V.at(1);
            odom.twist.twist.angular.z = V.at(2);

            //publish the message
            odom_pub.publish(odom);

            last_time = current_time;
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
        // std::cout<<"Send RPM: "<< W2RPM(W.at(0)) <<" "
        //                        << W2RPM(W.at(1))<<" "
        //                        << W2RPM(W.at(2))<<" "
        //                        << W2RPM(W.at(3))<<std::endl;
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
        double reduction = 30;
        return K*RPM/reduction;
    }
};

int main(int argc, char **argv)
{
  ros::init(argc, argv, "mobile_node");
  TimdaMobile tm;

//   ros::spin();

  return 0;
}

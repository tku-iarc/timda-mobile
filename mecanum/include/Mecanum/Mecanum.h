#include <iostream>
#include <vector>
#include <eigen3/Eigen/Dense>

class Mecanum
{
public:
    double a, b, R;
    Mecanum(double, double, double);
    ~Mecanum();
    std::vector<double> IK(double vx, double vy, double vw);
    std::vector<double> FK(double w1, double w2, double w3, double w4);
private:
    Eigen::MatrixXf J;
    Eigen::MatrixXf JI;
    Eigen::MatrixXf V;
    //Eigen::MatrixXf W;
    Eigen::VectorXf W;
    std::vector<double>VW;
    std::vector<double>VV;
};

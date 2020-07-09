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
private:
    Eigen::MatrixXf J;
    Eigen::MatrixXf V;
    //Eigen::MatrixXf W;
    Eigen::VectorXf W;
    std::vector<double>VW;
};

#include <iostream>
#include <Eigen/Dense>

class Mecanum
{
public:
    double a, b, R;
    Mecanum(double, double, double);
    ~Mecanum();
    void IK(double vx, double vy, double vw);
};

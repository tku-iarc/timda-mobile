#include <Mecanum/Mecanum.h>

Mecanum::Mecanum(double ia, double ib, double iR)
{
    a = ia;
    b = ib;
    R = iR;
}

Mecanum::~Mecanum()
{
}

std::vector<double> Mecanum::IK(double vx, double vy, double vw)
{
    Eigen::MatrixXf J(4, 3);
    Eigen::MatrixXf V(3, 1);
    Eigen::MatrixXf W;
    J << 1, -1, -1*(a + b),
         1,  1,  1*(a + b),
         1,  1, -1*(a + b),
         1, -1,  1*(a + b);
    V << vx, vy, vw;
    W = 1/R * (J*V);
    std::vector<double>MW(W.data(), W.data() + W.size());
    return MW;
}

#include <Mecanum/Mecanum.h>

Mecanum::Mecanum(double ia, double ib, double iR)
{
    a = ia;
    b = ib;
    R = iR;
    J.resize(4, 3);
    V.resize(3, 1);
}

Mecanum::~Mecanum()
{
}

std::vector<double> Mecanum::IK(double vx, double vy, double vw)
{
    J << 1, -1, -1*(a + b),
         1,  1,  1*(a + b),
         1,  1, -1*(a + b),
         1, -1,  1*(a + b);
    V << vx, vy, vw;
    W = 1/R * (J*V);
    VW.clear();
    VW.push_back(*(W.data() + 0));
    VW.push_back(*(W.data() + 1));
    VW.push_back(*(W.data() + 2));
    VW.push_back(*(W.data() + 3));
    return VW;
}


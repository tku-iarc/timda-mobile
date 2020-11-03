#include <Mecanum/Mecanum.h>

Mecanum::Mecanum(double ia, double ib, double iR)
{
    a = ia;
    b = ib;
    R = iR;
    J.resize(4, 3);
    V.resize(3, 1);
    JI.resize(3, 4);
    W.resize(4, 1);
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

std::vector<double> Mecanum::FK(double w1, double w2, double w3, double w4)
{
    JI <<  1,  1,  1,  1,
          -1,  1,  1, -1,
          -1/(a+b), 1/(a+b), -1/(a+b), 1/(a+b);
    W << w1, w2, w3, w4;
    V = R/4 * (JI*W);

    VV.clear();
    VV.push_back(*(V.data() + 0));
    VV.push_back(*(V.data() + 1));
    VV.push_back(*(V.data() + 2));
    return VV;
}

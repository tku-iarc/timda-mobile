#!/usr/bin/python
import numpy as np
from numpy import radians as rad
import math

class Mecanum(object):
  def __init__(self, a, b, R):
    self.a = a;
    self.b = b;
    self.R = R;

  def ik(self, vx, vy, vw):
    J = np.array([[1, -1, -1*(self.a + self.b)],
                  [1,  1,  1*(self.a + self.b)],
                  [1,  1, -1*(self.a + self.b)],
                  [1, -1,  1*(self.a + self.b)]])
    V = np.array([vx, vy, vw]).reshape(-1, 1)
    W = 1/self.R * np.dot(J, V).ravel()
    return W[0], W[1], W[2], W[3]

if __name__ == '__main__':
  m = Mecanum(0.48544, 0.253, 0.1524)
  vx = 0.2
  vy = 0.2
  vw = 0
  w1, w2, w3, w4 = m.ik(vx, vy, vw)
  print(w1, w2, w3, w4)

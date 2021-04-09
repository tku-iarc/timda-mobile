#!/usr/bin/env python
import rospy
import sys
import math
import time
from statemachine import StateMachine, State
from robot.robot import Robot
from std_msgs.msg import String
from my_sys import log, SysCheck, logInOne
from methods.chase import Chase
from methods.attack import Attack
from methods.behavior import Behavior
from dynamic_reconfigure.server import Server as DynamicReconfigureServer
from strategy.cfg import RobotConfig
import dynamic_reconfigure.client

class Core(Robot, StateMachine):

  last_ball_dis = 0
  last_goal_dis = 0
  last_time     = time.time()

  idle   = State('Idle', initial = True)
  chase  = State('Chase')

  toIdle   = chase.to(idle) | idle.to.itself()
  toChase  = idle.to(chase) | chase.to.itself() 

  def Callback(self, config, level):
    self.game_start = config['game_start']
    self.game_state = config['game_state']
    self.run_x      = config['run_x']
    self.run_y      = config['run_y']
    self.run_yaw    = config['run_yaw']
    self.strategy_mode = config['strategy_mode']
    self.maximum_v = config['maximum_v']
    self.minimum_v = config['minimum_v']

    self.ChangeVelocityRange(config['minimum_v'], config['maximum_v'])
    self.ChangeAngularVelocityRange(config['minimum_w'], config['maximum_w'])
    self.ChangeBallhandleCondition(config['ballhandle_dis'], config['ballhandle_ang'])

    self.SetMyRole(self.my_role)

    return config

  def __init__(self, sim = False):
    super(Core, self).__init__(sim)
    StateMachine.__init__(self)
    self.CC  = Chase()
    self.left_ang = 0
    self.dest_angle = 0
    dsrv = DynamicReconfigureServer(RobotConfig, self.Callback)

  def on_toIdle(self):
    Core.last_goal_dis = 0
    for i in range(0, 10):
        self.MotionCtrl(0,0,0)
    log("To Idle1")

  def on_toChase(self, method = "Classic"):


  def PubCurrentState(self):
    self.RobotStatePub(self.current_state.identifier)



      
  def record_angle(self):
    position = self.GetRobotInfo()
    self.dest_angle = math.degrees(position['imu_3d']['yaw']) - self.run_yaw

class Strategy(object):
  def __init__(self, sim=False):
    rospy.init_node('core', anonymous=True)
    self.rate = rospy.Rate(200)
    self.robot = Core(sim)
    self.dclient = dynamic_reconfigure.client.Client("core", timeout=30, config_callback=None)
    self.main()


  def ToChase(self):


  
  def main(self):
    while not rospy.is_shutdown():
      self.robot.PubCurrentState()
      self.robot.Supervisor()

      targets = self.robot.GetObjectInfo()
      position = self.robot.GetRobotInfo()
      mode = self.robot.strategy_mode
      state = self.robot.game_state
      laser = self.robot.GetObstacleInfo()
      point = self.robot.run_point

      # Can not find ball when starting
      if targets is None or targets['ball']['ang'] == 999 and self.robot.game_start:
        print("Can not find ball")
        self.robot.toIdle()
      else:
        if not self.robot.is_idle and not self.robot.game_start:
          self.robot.toIdle()

        if self.robot.is_idle:          
          if self.robot.game_start:
            else :
              print('idle to chase')
              self.ToChase()
              
        if self.robot.is_chase:
          #log(self.robot.dest_angle)
          if self.robot.CheckBallHandle():
            print('chase to move')
            self.ToMovement()
          else:
            self.ToChase()

        if rospy.is_shutdown():
          log('shutdown')
          break

        self.rate.sleep()

if __name__ == '__main__':
  try:
    if SysCheck(sys.argv[1:]) == "Native Mode":
      log("Start Native")
      s = Strategy(False)
    elif SysCheck(sys.argv[1:]) == "Simulative Mode":
      log("Start Sim")  
      s = Strategy(True)
  except rospy.ROSInterruptException:
    pass 

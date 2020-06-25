#!/usr/bin/env python

import RPi.GPIO as GPIO
import serial
from pymodbus.client.sync import ModbusSerialClient as ModbusClient
from pymodbus.register_read_message import ReadInputRegistersResponse
from pymodbus.register_read_message import ReadInputRegistersRequest
import rospy
import time

class MyModbus(object):
    def __init__(self):
        print("Initialized mymodbus.py...")
        rospy.init_node('mymodbus', anonymous=False)
        self.rate = rospy.Rate(1000)
        ### GPIO Setting ###
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(12, GPIO.OUT)
        ### Modbus Setting ###
        self.client = ModbusClient(method='rtu', port='/dev/ttyAMA0', \
                                   stopbits=1, timeout=0.3, \
                                   bytesize=8, parity='N', \
                                   baudrate='9600')
        if self.client.connect():
            print("Connected.")
        else:
            raise BaseException("Can not coneect")

    def __del__(self):
        print("Clenaup GPIO")
        GPIO.cleanup()

    def switch_transmission_mode(self, mode="post"):
        if mode.lower() == "get":
            GPIO.output(12, GPIO.LOW)
        elif mode.lower() == "post":
            GPIO.output(12, GPIO.HIGH)
        else:
            raise ValueError("Unknow mode. Must be 'get' or 'post'.")

    def set_rpm(self, rpm):
        print("Set rpm: ", rpm)

    def testing(self):
        print('OK')
        while not rospy.is_shutdown():
            if rospy.is_shutdown():
                break
            self.rate.sleep()

if __name__ == '__main__':
    try:
        m = MyModbus()
        m.testing()
    except rospy.ROSInterruptException:
        pass

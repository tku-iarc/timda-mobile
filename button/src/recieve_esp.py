#!/usr/bin/env python
import rospy
import serial 
from nodeMCU_python.srv import wifi_srv 

#COM_PORT = '/dev/ttyUSB0'    

BAUD_RATES = 115200    

list_ser = []

def recieve_data():      
    try: 
        while True:
            while ser.in_waiting:          
                list_ser.append(ser.read(1))
            
            if len(list_ser) >= 3:
                if list_ser[0] == 's' and list_ser[2] == 'e':
                    print(list_ser)
                    pass_esp8266_info_to_server(str(ord(list_ser[1])))
                    del list_ser [:]
                else:
                    del list_ser [:]
            

    except KeyboardInterrupt:
        ser.close()    
        print('good bye!')

def pass_esp8266_info_to_server(data):
    rospy.wait_for_service('wifi_module')
    try:
        #create a server object
        val = rospy.ServiceProxy('wifi_module', wifi_srv)
        #val(arg) -> send a req to server
        resp = val(data)
    except rospy.ServiceException, e:
        print ('error')

if __name__ == "__main__":
    rospy.init_node("NodeMCU")

    port_name = rospy.get_param('~port','/dev/ttyUSB0')
    #baud = int(rospy.get_param('~baud','57600'))
    print("try to connect with {port_name}")

    ser = serial.Serial(port_name, BAUD_RATES) 
    print("connection succeeded!")  

    recieve_data()
import os
import socket
import sys
import time
import socketio

HOST = '127.0.0.1'
PORT = 12345

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

while s.connect_ex((HOST, PORT)) != 0:
    print("[*] Try to connect...")
    time.sleep(1)

while True:
    s.sendall("PING")
    print("[*] Send PING")
    response = s.recv(1024)
    if response.upper() == "PONG":
        print("[*] Received {}".format(response))
        time.sleep(1)
    else:
        print("[*] Received {}".format(response))
        s.close()


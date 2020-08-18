import os
import sys
import time
import socketio

sio = socketio.Client()

sio.connect('http://localhost:3000')
sio.wait()

@sio.event
def message(data):
    print('I received a message ', data)

@sio.on('my message')
def on_message(data):
    print('I received a message ', data)

@sio.on('pong')
def on_message(data):
    print('I received a message ', data)

@sio.event
def connect():
    print("I'm connected!")

@sio.event
def connect_error():
    print("The connection failed!")

@sio.event
def disconnect():
    print("I'm disconnected!")

while True:
    sio.emit('ping', {'ping': 'ping'})
    time.sleep(.5)


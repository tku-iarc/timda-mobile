import socketio
import time
from threading import Timer, Event, Thread
from wakeonlan import send_magic_packet

HOST_IP = '10.0.0.1'
HOST_MAC = 'b8:ae:ed:71:65:45'
HOST_BROADCAST = '10.0.0.255'
HOST_WOL_PORT = 9

sio = socketio.Client()
event = Event()
CONNECTED = False
LAST_CONNECT_TIME = time.time()

# class HeartbeatThread(Thread):

#     def __init__(self, socket, event):
#         super(HeartbeatThread, self).__init__()
#         self.socket = socket
#         self.eve = event

#     def run(self):
#         while 1:
#             ## Send Ping Pack
#             # self.ws.send('2')
#             print("Send...")
#             self.socket.emit('ping', {'ping': 'ping'})
#             self.eve.wait(timeout=2)

@sio.event
def connect():
    print('[*] Connection established')
    print('[*] Start Ping-pong')
    sio.emit('ping', {'ping': 'ping'})

@sio.on('pong')
def on_message(data):
    LAST_CONNECT_TIME = time.time()
    print("[*] I got pong '{}', I will 'ping!' back".format(data))
    time.sleep(.5)
    sio.emit('ping', {'ping': 'ping'})

@sio.event
def disconnect():
    print('[*] Disconnected from server.')

@sio.event
def connect_error(message):
    if (time.time() - LAST_CONNECT_TIME) > 10:
        print('[*] Connection error timeout due to ' + message)

## Example 1
# @sio.event
# deprint('Connection was rejected due to ' + message)
#     print('message received with ', data)
#     print('by io.emit my_message')
#     sio.emit('my response', {'response': 'my response'})

if __name__ == "__main__":

    """
    If this program is already running, but server does not run yet.
    Try to startup server by WoL and keep connecting until connected.
    """
    send_magic_packet(HOST_MAC,
                        ip_address=HOST_BROADCAST,
                        port=HOST_WOL_PORT)
    while not CONNECTED:
        try:
            print('Try to connect to http://'+HOST_IP+':3000 ......')
            sio.connect('http://'+HOST_IP+':3000')
            send_magic_packet(HOST_MAC,
                              ip_address=HOST_BROADCAST,
                              port=HOST_WOL_PORT)
        except socketio.exceptions.ConnectionError as err:
            print("ConnectionError: {}".format(err))
            send_magic_packet(HOST_MAC,
                              ip_address=HOST_BROADCAST,
                              port=HOST_WOL_PORT)
        else:
            print("Connected!")
            CONNECTED = True

        time.sleep(1)

    sio.wait()

    # hbt = HeartbeatThread(sio, event)
    # hbt.start()

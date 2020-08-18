import os
import socketserver
import socket

HOST = os.popen("ifconfig lo | awk '/inet / {print $2}'").read()
PORT = 12345

class MyTCPHandler(socketserver.BaseRequestHandler):

    def handle(self):

        self.data = self.request.recv(1024).strip()

        print ("{} wrote:".format(self.client_address[0]))
        print (self.data)

        self.request.sendall("PONG")

if __name__ == "__main__":

    server = socketserver.TCPServer((HOST, PORT), MyTCPHandler)
    server.serve_forever()

import os
import sys
import socketserver
import socket
import threading

HOST = os.popen("ifconfig lo | awk '/inet / {print $2}'").read()
PORT = 12345

def handle_client(client_socket):
    request = client_socket.recv(1024)
    print("[*] Received: {}".format(request))

    if request.upper() == "PING":
        client_socket.send("PONG")
    else:
        client_socket.send("PONG?")
    #client_socket.close()

def start_tcp_server(ip, port):
    #create socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_address = (ip, port)
    #bind port
    print('[*] Starting listen on ip %s, port %s'%server_address)
    sock.bind(server_address)
    #starting listening, allow only one connection
    try:
        sock.listen(5)
    except socket.error, e:
        print "fail to listen on port %s"%e
        sys.exit(1)

    while True:
        print("[*] Waiting for connection")
        client, addr = sock.accept()

        client_handler = threading.Thread(target=handle_client, args=(client,))
        client_handler.start()

if __name__ == '__main__':
    start_tcp_server(HOST, PORT)

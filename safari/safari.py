import json
import socket

from websocket import WebSocket


ws = WebSocket()

# if ipv6
ws.io_sock = ws.sock = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
ws.connect("ws://localhost:9999/devtools/page/1")

counter = 0

def send(method, params):
  global counter
  counter += 1
  # separators is important, you'll get "Message should be in JSON format." otherwise
  message = json.dumps({"id": counter, "method": method, "params": params}, separators=(',', ':'))
  print "> %s" % (message,)
  ws.send(message)

def recv():
  result = ws.recv()
  print "< %s" % (result,)

send('Runtime.evaluate', {'expression': 'alert("hello from python")'})
recv()
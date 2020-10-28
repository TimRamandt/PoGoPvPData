# documentation https://www.afternerd.com/blog/python-http-server/
# how to stop this bad boi: https://stackoverflow.com/questions/39632667/how-do-i-kill-the-process-currently-using-a-port-on-localhost-in-windows

import http.server
import socketserver

PORT = 8088

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("listening at port", PORT)
    httpd.serve_forever()
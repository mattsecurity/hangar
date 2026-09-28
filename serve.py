#!/usr/bin/env python3
"""Local dev server for Hangar (no-cache). Usage: python3 serve.py [port]"""
import http.server, sys

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
http.server.ThreadingHTTPServer(("127.0.0.1", port), NoCache).serve_forever()

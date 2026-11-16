"""Local-only SMTP inbox for account E2E. Capture file contains test reset links: keep it outside Git."""
import argparse
import json
import socketserver
import threading
from pathlib import Path
from email.parser import BytesParser
from email.policy import default

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port', type=int, default=25862)
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
destination = args.output.resolve()
destination.parent.mkdir(parents=True, exist_ok=True)
destination.write_text('[]', encoding='utf8')
lock = threading.Lock()

class Capture(socketserver.StreamRequestHandler):
    def send(self, line):
        self.wfile.write((line + '\r\n').encode('ascii'))
        self.wfile.flush()

    def handle(self):
        self.send('220 localhost QA capture')
        while True:
            command = self.rfile.readline()
            if not command:
                return
            verb = command.decode('utf8', errors='replace').strip().upper()
            if verb.startswith(('EHLO', 'HELO')):
                self.send('250-localhost')
                self.send('250 8BITMIME')
            elif verb.startswith(('MAIL FROM:', 'RCPT TO:', 'RSET', 'NOOP')):
                self.send('250 OK')
            elif verb == 'QUIT':
                self.send('221 Bye')
                return
            elif verb == 'DATA':
                self.send('354 End data with dot')
                data = []
                total = 0
                while True:
                    line = self.rfile.readline()
                    if line == b'.\r\n':
                        break
                    if not line:
                        return
                    total += len(line)
                    if total > 1000000:
                        self.send('552 Test message too large')
                        return
                    data.append(line[1:] if line.startswith(b'..') else line)
                message = BytesParser(policy=default).parsebytes(b''.join(data))
                with lock:
                    messages = json.loads(destination.read_text(encoding='utf8'))
                    messages.append({'to': str(message['To']), 'subject': str(message['Subject']), 'body': message.get_content()})
                    destination.write_text(json.dumps(messages, ensure_ascii=False, indent=2), encoding='utf8')
                self.send('250 Captured locally')
            else:
                self.send('502 Unsupported QA command')

class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True

with Server(('127.0.0.1', args.port), Capture) as server:
    print(f'Local-only SMTP capture ready on {args.port}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass

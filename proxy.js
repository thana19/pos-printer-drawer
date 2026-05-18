// WebSocket → TCP proxy สำหรับส่งคำสั่งไปเครื่องพิมพ์ผ่าน Network
// รัน: node proxy.js
const { WebSocketServer } = require('ws');
const net = require('net');

const PORT = 8765;
const wss = new WebSocketServer({ port: PORT });

console.log(`[proxy] WebSocket server listening on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  console.log('[proxy] Client connected');

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    const { ip, port, data } = msg;
    if (!ip || !port || !data) return;

    const buf = Buffer.from(data);
    const sock = net.createConnection({ host: ip, port }, () => {
      sock.write(buf, () => {
        console.log(`[proxy] Sent ${buf.length} bytes to ${ip}:${port}`);
        sock.end();
      });
    });

    sock.on('error', (e) => {
      console.error('[proxy] TCP error:', e.message);
      ws.send(JSON.stringify({ error: e.message }));
    });
  });

  ws.on('close', () => console.log('[proxy] Client disconnected'));
});

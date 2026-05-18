# POS Drawer Test

เว็บแอปทดสอบเปิดลิ้นชักเงิน (Cash Drawer) สำหรับเครื่อง POS ที่เชื่อมต่อผ่าน RJ11 กับเครื่องพิมพ์ใบเสร็จ

**Live Demo:** https://pos-drawer.thana.in.th

---

## วิธีทำงาน

ลิ้นชักเงินเชื่อมต่อกับเครื่องพิมพ์ผ่านสาย RJ11 (DK Port) การเปิดลิ้นชักทำได้โดยส่ง ESC/POS command ไปที่เครื่องพิมพ์:

```
1B 70 00 19 FA  →  เปิด Pin 2 (ค่าเริ่มต้น)
1B 70 01 19 FA  →  เปิด Pin 5
```

---

## วิธีเชื่อมต่อ

### Serial / COM Port
ใช้ [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) เชื่อมต่อกับเครื่องพิมพ์ที่ต่อผ่าน COM Port หรือ USB-to-Serial

- รองรับเฉพาะ **Chrome / Edge** เท่านั้น
- เลือก Baud Rate ให้ตรงกับเครื่องพิมพ์ (ทั่วไปใช้ 115200)

### USB Printer
ใช้ [WebUSB API](https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API) เชื่อมต่อกับเครื่องพิมพ์ USB โดยตรง

- รองรับเฉพาะ **Chrome / Edge** เท่านั้น

### Network (IP)
สำหรับเครื่องพิมพ์ที่ต่อผ่าน LAN / WiFi ต้องรัน `proxy.js` เป็น WebSocket proxy ก่อน เนื่องจาก browser ไม่สามารถเปิด TCP socket ตรงได้

```bash
# ติดตั้ง dependency
npm install ws

# รัน proxy server
node proxy.js
```

จากนั้นใส่ IP เครื่องพิมพ์และ Port (ค่าเริ่มต้น 9100) ในหน้าเว็บ

---

## การใช้งาน

1. เปิด `index.html` ด้วย **Chrome หรือ Edge**
2. เลือก Tab วิธีเชื่อมต่อ (Serial / USB / Network)
3. กด **เชื่อมต่อ**
4. เลือก Pin (2 หรือ 5) ตามสายที่ใช้
5. กด **เปิด Drawer**

---

## โครงสร้างไฟล์

```
pos-drawer/
├── index.html   # Web app หลัก
└── proxy.js     # WebSocket → TCP proxy สำหรับ Network mode
```

---

## Browser Support

| Browser | Serial | USB | Network |
|---------|--------|-----|---------|
| Chrome  | ✅     | ✅  | ✅      |
| Edge    | ✅     | ✅  | ✅      |
| Firefox | ❌     | ❌  | ✅      |
| Safari  | ❌     | ❌  | ✅      |

---

## Deploy

โปรเจกต์นี้ deploy บน [Cloudflare Pages](https://pages.cloudflare.com/)

```bash
# ติดตั้ง wrangler
npm install -g wrangler

# Deploy
wrangler pages deploy . --project-name pos-drawer
```

Custom domain: `pos-drawer.thana.in.th` → CNAME → `pos-drawer.pages.dev` (Proxied)

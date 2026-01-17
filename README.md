# Web Cơ Bản - Todo App

## 📌 Giới thiệu
Đây là project web cơ bản sử dụng:

- HTML, CSS, JavaScript
- NodeJS (Express)
- SQLite để lưu dữ liệu

Chức năng:
- Thêm công việc
- Xóa công việc
- Đánh dấu hoàn thành
- Lưu dữ liệu vào database

---

## 🧱 Công nghệ sử dụng
- HTML, CSS, JS
- NodeJS + Express
- SQLite
┌─────────────────────────────────────┐
│   BROWSER (Frontend)                │
│  HTML5 + CSS3 + Vanilla JavaScript  │
│  Gọi API: fetch(), $.ajax()         │
└────────────────┬────────────────────┘
                 │ HTTP Requests
                 ▼
┌─────────────────────────────────────┐
│   Node.js + Express (Backend)       │
│  Xử lý API: GET, POST, PUT          │
│  CORS: Cho phép cross-origin        │
└────────────────┬────────────────────┘
                 │ SQL Queries
                 ▼
┌─────────────────────────────────────┐
│   SQLite3 Database                  │
│  Lưu trữ dữ liệu todos              │
└─────────────────────────────────────┘
---

## ⚙️ Cách cài đặt và chạy project

Clone project
```bash
git clone <link-repo>
cd web_co_ban
cai dat nodejs tai https://nodejs.org/en/download/current
- npm install
- node server.js
- node server.js
thuc hien cac thao tac tren web
De kiem tra du lieu ghi vao db thuc hien cac thao tac sao
cai dat extension sqlite (vscode)
Ctrl + Shift + P -> SQLite: Open Database -> SQLITE EXPLORER (goc duoc ben phai) -> chuot phai vao bang va chon show table

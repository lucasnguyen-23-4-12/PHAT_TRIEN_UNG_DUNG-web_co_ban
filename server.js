const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');

const app = express();
// Thay đổi dòng khởi tạo DB trong server.js thành:
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) console.error(err.message);
    // Ép SQLite ghi dữ liệu ngay lập tức
    db.run("PRAGMA journal_mode = DELETE"); 
});

app.use(cors());
app.use(express.json());

// Khởi tạo Database
db.serialize(() => {
    // Tạo bảng
    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT,
        completed INTEGER
    )`);

    // Kiểm tra nếu bảng trống thì nạp dữ liệu từ data.json vào
    db.get("SELECT COUNT(*) as count FROM todos", (err, row) => {
        if (row.count === 0) {
            const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
            const stmt = db.prepare("INSERT INTO todos (id, task, completed) VALUES (?, ?, ?)");
            data.forEach(item => {
                stmt.run(item.id, item.task, item.completed ? 1 : 0);
            });
            stmt.finalize();
            console.log("Đã nạp dữ liệu mẫu từ data.json vào SQLite.");
        }
    });
});

// Các API cho Frontend gọi
app.get('/tasks', (req, res) => {
    db.all("SELECT * FROM todos", [], (err, rows) => {
        res.json(rows.map(r => ({ ...r, completed: !!r.completed })));
    });
});

app.post('/tasks', (req, res) => {
    const { task } = req.body;
    console.log("Đang thêm task mới:", task); 
    
    // Sử dụng callback để kiểm tra lỗi
    db.run("INSERT INTO todos (task, completed) VALUES (?, 0)", [task], function(err) {
        if (err) {
            console.error("Lỗi SQLite:", err.message);
            return res.status(500).json({ error: err.message });
        }
        // Nếu thành công, trả về ID vừa tạo
        console.log("Ghi vào SQLite thành công với ID:", this.lastID);
        res.json({ id: this.lastID, task, completed: false });
    });
});

app.put('/tasks/:id', (req, res) => {
    const { completed } = req.body;
    const id = req.params.id;
    const status = completed ? 1 : 0; // SQLite dùng 0 và 1

    console.log(`Đang cập nhật task ID ${id} thành trạng thái: ${status}`);

    db.run("UPDATE todos SET completed = ? WHERE id = ?", [status, id], function(err) {
        if (err) {
            console.error("Lỗi cập nhật:", err.message);
            return res.status(500).send(err.message);
        }
        console.log(`Cập nhật thành công cho ID ${id}`);
        res.sendStatus(200);
    });
});

app.listen(3000, () => console.log("Server chạy tại http://localhost:3000"));
// Biến để chứa dữ liệu sau khi tải từ file JSON
let tasks = [];

// 1. Hàm tải dữ liệu từ file data.json
async function loadData() {
    try {
        // Gửi yêu cầu lấy file JSON
        const response = await fetch('data.json');
        
        // Chuyển đổi dữ liệu nhận được thành mảng JavaScript
        tasks = await response.json();
        
        // Sau khi có dữ liệu, gọi hàm hiển thị
        renderTasks();
    } catch (error) {
        console.error("Không thể tải dữ liệu:", error);
    }
}

// 2. Hàm hiển thị danh sách (Sửa từ initialTasks thành tasks)
function renderTasks() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = "";

    tasks.forEach(item => {
        const li = document.createElement('li');

        const statusText = item.completed ? "Đã hoàn thành" : "Chưa hoàn thành";
        const statusClass = item.completed ? "status-done" : "status-pending";

        li.innerHTML = `
             
            <span class="task-text">${item.task}</span>
            <span class="status ${statusClass}">${statusText}</span>
        `;
        
        if (item.completed) {
            li.classList.add('checked');
        }

        todoList.appendChild(li);
    });
}

// Chức năng chuyển đổi Theme
const themeBtn = document.getElementById('theme-toggle');

themeBtn.addEventListener('click', () => {
    // Mỗi lần click sẽ thêm hoặc xóa class "dark-mode" khỏi thẻ body
    document.body.classList.toggle('dark-mode');
    
    // (Tùy chọn) Lưu lựa chọn của người dùng vào LocalStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Kiểm tra xem lần trước người dùng đã chọn theme nào chưa
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}
// 3. Thay window.onload bằng việc gọi hàm loadData
document.addEventListener('DOMContentLoaded', loadData);
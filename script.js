// Biến để chứa dữ liệu sau khi tải từ file JSON
let tasks = [];

// Hàm tải dữ liệu từ file data.json
async function loadData() {
    try {
        const response = await fetch('data.json');
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error("Không thể tải dữ liệu:", error);
    }
}
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

// 2. Hàm hiển thị danh sách (CẬP NHẬT: Thêm thanh trạng thái select)
function renderTasks() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = "";

    tasks.forEach((item, index) => {
        const li = document.createElement('li');

        // Tạo cấu trúc gồm tên công việc và thanh chọn trạng thái (dropdown)
        li.innerHTML = `
            <span class="task-text ${item.completed ? 'checked' : ''}">${item.task}</span>
            <select class="status-select" onchange="updateStatus(${index}, this.value)">
                <option value="false" ${!item.completed ? 'selected' : ''}>Chưa xong</option>
                <option value="true" ${item.completed ? 'selected' : ''}>Đã xong</option>
            </select>
        `;
        
        todoList.appendChild(li);
    });
}
// Hàm cập nhật trạng thái khi người dùng thay đổi trên Dropdown
function updateStatus(index, value) {
    // Chuyển giá trị từ chuỗi "true"/"false" sang kiểu Boolean
    tasks[index].completed = (value === "true");
    
    // Vẽ lại giao diện để cập nhật hiệu ứng gạch chân
    renderTasks();
    console.log("Dữ liệu tạm thời đã thay đổi:", tasks);
}
// 4. Hàm tải về dữ liệu dưới dạng file JSON (MỚI)
function downloadJSON() {
    // Chuyển mảng tasks thành chuỗi văn bản JSON
    const dataStr = JSON.stringify(tasks, null, 4);
    
    // Tạo file ảo trong bộ nhớ trình duyệt
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Tạo lệnh tải xuống
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json'; 
    link.click();
    
    // Giải phóng bộ nhớ
    URL.revokeObjectURL(url);
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
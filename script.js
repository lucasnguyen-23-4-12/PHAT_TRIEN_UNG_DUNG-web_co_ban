// Biến để chứa dữ liệu sau khi tải từ file JSON
let tasks = [];
const API_URL = "http://localhost:3000/tasks";
// 1. Tải dữ liệu từ SQLITE (thông qua Server)
async function loadData() {
    try {
        // Thay vì fetch('data.json'), ta gọi API từ server
        const response = await fetch(API_URL);
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error("Không thể kết nối Server:", error);
    }
}

// 2. Cập nhật hàm renderTasks (Giống cũ nhưng dùng ID từ DB)
function renderTasks() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = "";
    tasks.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-info">
                <span class="task-text ${item.completed ? 'checked' : ''}">${item.task}</span>
            </div>
            <div class="task-actions">
                <select class="status-select" onchange="updateStatus(${index}, this.value)">
                    <option value="false" ${!item.completed ? 'selected' : ''}>Chưa xong</option>
                    <option value="true" ${item.completed ? 'selected' : ''}>Đã xong</option>
                </select>
                <button class="delete-btn" onclick="deleteTask(${index})">Xóa</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}
// 3. THÊM CÔNG VIỆC (Gửi lên Server)
async function addTask() {
    const input = document.getElementById('todo-input');
    const taskContent = input.value.trim();

    if (taskContent === "") {
        alert("Vui lòng nhập nội dung công việc!");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: taskContent })
        });
        const newTask = await response.json();
        
        tasks.push(newTask); // Thêm kết quả server trả về (có ID từ SQLite) vào mảng
        input.value = "";
        renderTasks();
        console.log("Đã lưu vào SQLite:", newTask);
    } catch (error) {
        console.error("Lỗi khi thêm task:", error);
    }
}
// 6. CHỨC NĂNG XÓA CÔNG VIỆC (MỚI)
function deleteTask(index) {
    if (confirm("Bạn có chắc chắn muốn xóa công việc này không?")) {
        // Xóa 1 phần tử tại vị trí index trong mảng tasks
        tasks.splice(index, 1);
        
        // Vẽ lại danh sách sau khi xóa
        renderTasks();
        console.log("Đã xóa công việc tại vị trí:", index);
    }
}
// Hàm cập nhật trạng thái khi người dùng thay đổi trên Dropdown
async function updateStatus(index, value) {
    const isCompleted = (value === "true");
    const taskId = tasks[index].id; // Lấy ID từ SQLite

    console.log("Gửi yêu cầu cập nhật ID:", taskId, "Trạng thái:", isCompleted);

    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: isCompleted })
        });

        if (response.ok) {
            tasks[index].completed = isCompleted;
            renderTasks();
            console.log("Cập nhật thành công trên server");
        }
    } catch (error) {
        console.error("Lỗi khi kết nối server để cập nhật:", error);
    }
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
// Thêm sự kiện nhấn phím Enter cho ô input
document.getElementById('todo-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
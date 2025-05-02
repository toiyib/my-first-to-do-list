let tasks = {}; // เก็บงานในแต่ละวัน
let selectedDate = 'today'; // กำหนดวันที่เลือกเริ่มต้นเป็น "วันนี้"

// โหลดงานจาก localStorage เมื่อเริ่ม
window.onload = function () {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
      console.log('Loaded tasks from localStorage:', tasks); // เพิ่มการแสดงผลเพื่อดูข้อมูลที่โหลด
    } else {
      console.log('No tasks found in localStorage');
    }
    updateTaskList(); // อัปเดตรายการงานตามวันที่เลือก
  };
  

// ฟังก์ชันเลือกวันที่ (วันนี้, เมื่อวาน, พรุ่งนี้)
function addTask() {
    const taskText = document.getElementById("taskInput").value.trim();
  
    if (taskText === "") {
      alert("กรุณากรอกงานที่จะทำค่ะ");
      return;
    }
  
    const date = getSectionDate(selectedDate); // ใช้วันที่แบบ yyyy-mm-dd
  
    if (!tasks[date]) {
      tasks[date] = [];
    }
  
    tasks[date].push({ text: taskText, completed: false });
    console.log('Task added:', tasks[date]);
    saveTasks();
    updateTaskList();
    document.getElementById("taskInput").value = "";
  }
  
  
// แสดงงานตามวันที่เลือก
function updateTaskList() {
  const taskSections = document.getElementById("taskSections");
  taskSections.innerHTML = ""; // เคลียร์ข้อมูลเดิม

  const sections = ["today", "tomorrow", "yesterday"];

  sections.forEach(section => {
      const date = getSectionDate(section);

      // สร้าง div สำหรับแต่ละวัน และเพิ่มคลาสเพื่อแยกแต่ละวัน
      const dayContainer = document.createElement("div");
      dayContainer.classList.add(`task-container`, `task-container-${section}`);

      // เพิ่มหัวข้อกลุ่มวัน (วันนี้, เมื่อวาน, พรุ่งนี้)
      const header = document.createElement("h3");
      header.textContent = getSectionHeader(section);
      header.classList.add("task-header");
      dayContainer.appendChild(header);

      // สร้าง ul สำหรับรายการงาน
      const ul = document.createElement("ul");
      ul.classList.add("task-list");

      if (tasks[date] && tasks[date].length > 0) {
          tasks[date].forEach(task => {
              const li = document.createElement("li");
              li.textContent = task.text;
              if (task.completed) li.classList.add("completed");

              li.addEventListener("click", function () {
                  task.completed = !task.completed;
                  saveTasks();
                  updateTaskList();
              });

              ul.appendChild(li);
          });
      } else {
          const li = document.createElement("li");
          li.textContent = "ไม่มีงานในวันนี้";
          ul.appendChild(li);
      }

      // เพิ่ม ul ที่มีรายการงานเข้าไปใน div ของวันนั้น
      dayContainer.appendChild(ul);

      // เพิ่ม div ของวันนั้นเข้าไปใน taskSections
      taskSections.appendChild(dayContainer);
  });
}


  
  

// บันทึกงานใน localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ฟังก์ชันสำหรับได้วันที่พรุ่งนี้
function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0]; // คืนค่าในรูปแบบ yyyy-mm-dd
}

// ฟังก์ชันสำหรับได้วันที่เมื่อวาน
function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0]; // คืนค่าในรูปแบบ yyyy-mm-dd
}

// ฟังก์ชันสำหรับได้วันที่ปัจจุบัน
function getCurrentDate() {
  const today = new Date();
  return today.toISOString().split('T')[0]; // คืนค่าในรูปแบบ yyyy-mm-dd
}

// ฟังก์ชันเพื่อเลือกวันที่สำหรับกลุ่มต่างๆ
function getSectionDate(section) {
  if (section === "today") return getCurrentDate();
  if (section === "tomorrow") return getTomorrowDate();
  if (section === "yesterday") return getYesterdayDate();
}

// ฟังก์ชันเพื่อแสดงชื่อกลุ่มของงาน
function getSectionHeader(section) {
  if (section === "today") return "วันนี้";
  if (section === "tomorrow") return "พรุ่งนี้";
  if (section === "yesterday") return "เมื่อวาน";
}

function setDate(dateKey) {
    selectedDate = dateKey;  // 'today' | 'tomorrow' | 'yesterday'
    updateTaskList();
  }


// ล้างข้อมูลทั้งหมด
function clearAllTasks() {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างงานทั้งหมด?")) {
      tasks = {};
      saveTasks();
      updateTaskList();
    }
  }
  
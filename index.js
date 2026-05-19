const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = sessionStorage.getItem("filter") || "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {

    if (currentFilter === "pending") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  filteredTasks.forEach(task => {

    const li = document.createElement("li");

    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span>${task.text}</span>

      <div>
        <button onclick="toggleTask(${task.id})">
          ✔
        </button>

        <button onclick="deleteTask(${task.id})">
          ✖
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateCounter();
}

addBtn.addEventListener("click", () => {

  const text = taskInput.value.trim();

  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();
  renderTasks();

  taskInput.value = "";

  sessionStorage.removeItem("draft");
});

function toggleTask(id) {

  tasks = tasks.map(task => {

    if (task.id === id) {
      task.completed = !task.completed;
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id) {

  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  renderTasks();
}
document.querySelectorAll("[data-filter]")
.forEach(button => {

  button.addEventListener("click", () => {

    currentFilter = button.dataset.filter;

  
    sessionStorage.setItem("filter", currentFilter);

    renderTasks();
  });
});

taskInput.addEventListener("input", () => {

  sessionStorage.setItem("draft", taskInput.value);
});

taskInput.value = sessionStorage.getItem("draft") || "";


function updateCounter() {

  const completed = tasks.filter(task => task.completed).length;

  counter.textContent =
    `Completadas: ${completed} / ${tasks.length}`;
}

const darkMode = localStorage.getItem("darkMode");

if (darkMode === "true") {
  document.body.classList.add("dark");
}

themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark")
  );
});

renderTasks();
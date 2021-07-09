
createAddTaskHandler()
let ul = document.getElementById("task-list");

class Task {
    constructor(taskText, status, index) {
        this.taskText = taskText;
        this.status = status;
        this.liIndex = index;
    }
}

class Tasks {
    constructor() {
        this.tasks = [];
        this.liIndex = 0;
    }

    addTask(taskText, status) {
        this.tasks.push(new Task(taskText, status, this.liIndex));
        this.liIndex++;
    }

    getAllTasks() {
        return this.tasks;
    }

    loadFromJson(json) {
        Object.assign(this, json);
    }

    removeTask(index) {
        for (let i = 0; i < this.tasks.length; i++) {
            if (Number(this.tasks[i].liIndex) === Number(index)) {
                this.tasks.splice(i, 1);
                refreshData();
            }
        }
    }

    toggleCheckBox(index) {
        for (let i = 0; i < this.tasks.length; i++) {
            if (Number(this.tasks[i].liIndex) === Number(index)) {
                this.tasks[i].status = !this.tasks[i].status;
                refreshData();
            }
        }
    }
}

// Load and show all saved tasks
let taskList = new Tasks();
loadData();

// Load all tasks from local storage
function loadData() {
    ul.innerHTML = "";
    taskList.loadFromJson(JSON.parse(localStorage.getItem("tasks")) || []);
    taskList.getAllTasks().forEach(task => loadTask(task));
}

// Save all tasks to local storage
function saveData() {
    localStorage.removeItem("tasks");
    localStorage.setItem("tasks", JSON.stringify(taskList));
}

function refreshData() {
    saveData();
    loadData();
}

// Add button task handler
function createAddTaskHandler() {
    let btnAddTask = document.getElementById("add-task-button");
    if (btnAddTask) {
        btnAddTask.addEventListener("click", function () {
            AddTask();
        });
    }
}

// Add task function
function AddTask() {
    let inputText = document.getElementById("input-task");

    if (inputText.value === "") {
        alert('No input data in the text area!');
        console.log("no input data in the text area!");
    } else {
        console.log("task added with text: " + inputText.value);

        taskList.addTask(inputText.value, false);
        refreshData();
        inputText.value = "";
    }
}

// Remove task function
function deleteItem(btn) {
    let parentLiElement = btn.parentElement;
    let parentTaskText = parentLiElement.querySelector("span").textContent;
    console.log("task " + parentTaskText + " deleted");
    // parentLiElement.remove();
    taskList.removeTask(parentLiElement.id);
    refreshData();
}

// Add line-through class for span node
function toggleLineThrough(checkBox) {
    taskList.toggleCheckBox(checkBox.parentElement.parentElement.id);
    checkBox.parentElement.parentElement.querySelector("span").classList.toggle("line-through");
    refreshData();
}

function loadTask(task = new Task()) {
    ul.appendChild(createTaskLiTemplate(task.taskText, task.status, task.liIndex));
}

function createTaskLiTemplate(taskText, status, liIndex) {
    let li = document.createElement("li");
    li.id = liIndex;
    let label = document.createElement("label");
    let input = document.createElement("input");
    input.type = "checkbox";
    input.addEventListener("change", function () {
        toggleLineThrough(input);
    })
    let span = document.createElement("span");
    span.className = "task";
    span.appendChild(document.createTextNode(taskText));
    let button = document.createElement("button");
    button.className = "delete-btn";
    button.addEventListener("click", function () {
        deleteItem(button);
    });
    label.appendChild(input);
    li.appendChild(label);
    li.appendChild(span);
    li.appendChild(button);

    if (status) {
        input.checked = true;
        span.classList.toggle("line-through");
    }

    return li;
}
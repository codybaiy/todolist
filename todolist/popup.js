document.addEventListener('DOMContentLoaded', () => {
  // 获取输入框和按钮元素
  const taskInput = document.getElementById('new-task');
  const addTaskButton = document.getElementById('add-task-button');

  // 绑定事件处理程序
  addTaskButton.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  });

  document.getElementById('toggle-completed-tasks-button').addEventListener('click', toggleCompletedTasks);

  loadTasks();
});

function addTask() {
  const taskInput = document.getElementById('new-task');
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  chrome.storage.local.get(['tasks'], ({ tasks }) => {
    console.log('当前任务:', tasks); // 添加日志
    tasks = tasks || [];
    tasks.push({ text: taskText, completed: false });
    chrome.storage.local.set({ tasks }, () => {
      console.log('更新后任务:', tasks); // 添加日志
      taskInput.value = '';
      loadTasks();
    });
  });
}

function toggleTaskCompletion(index) {
  chrome.storage.local.get(['tasks'], ({ tasks }) => {
    tasks[index].completed = !tasks[index].completed;
    chrome.storage.local.set({ tasks }, () => {
      loadTasks();
    });
  });
}

function deleteTask(index) {
  chrome.storage.local.get(['tasks'], ({ tasks }) => {
    tasks.splice(index, 1);
    chrome.storage.local.set({ tasks }, () => {
      loadTasks();
    });
  });
}

function loadTasks() {
  chrome.storage.local.get(['tasks'], ({ tasks }) => {
    tasks = tasks || [];
    const taskList = document.getElementById('task-list');
    const completedTasksList = document.getElementById('completed-tasks');

    taskList.innerHTML = '';
    completedTasksList.innerHTML = '';

    tasks.forEach((task, index) => {
      const listItem = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.onchange = () => toggleTaskCompletion(index);

      const label = document.createElement('label');
      label.textContent = task.text;
      label.className = `task-label ${task.completed ? 'completed' : ''}`; // 添加类名

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '删除';
      deleteButton.className = 'delete-button'; // 添加类名
      deleteButton.onclick = () => deleteTask(index);

      listItem.appendChild(checkbox);
      listItem.appendChild(label);
      listItem.appendChild(deleteButton);

      if (task.completed) {
        completedTasksList.appendChild(listItem);
      } else {
        taskList.appendChild(listItem);
      }
    });
  });
}

function toggleCompletedTasks() {
  const completedTasksList = document.getElementById('completed-tasks');
  completedTasksList.classList.toggle('hidden');
}
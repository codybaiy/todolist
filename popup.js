document.addEventListener('DOMContentLoaded', () => {
  // 绑定事件处理程序
  document.getElementById('add-task-button').addEventListener('click', addTask);
  document.getElementById('toggle-completed-tasks-button').addEventListener('click', toggleCompletedTasks);

  loadTasks();
});

function addTask() {
  const taskInput = document.getElementById('new-task');
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  chrome.storage.local.get(['tasks'], ({ tasks }) => {
    console.log('Current tasks:', tasks); // 添加日志
    tasks = tasks || [];
    tasks.push({ text: taskText, completed: false });
    chrome.storage.local.set({ tasks }, () => {
      console.log('Updated tasks:', tasks); // 添加日志
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
      deleteButton.textContent = 'Delete';
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
// script.js
document.addEventListener('DOMContentLoaded', function() {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const taskCount = document.getElementById('task-count');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function updateTaskCount() {
      taskCount.innerText = `${tasks.length} tasks`;
  }

  function renderTasks(filter = 'all') {
      taskList.innerHTML = '';
      tasks.forEach((task, index) => {
          if (filter === 'all' || (filter === 'completed' && task.completed) || (filter === 'pending' && !task.completed)) {
              const taskItem = document.createElement('li');
              taskItem.className = task.completed ? 'completed' : '';
              taskItem.innerHTML = `
                  <span class="task-text" ondblclick="editTask(${index})">${task.text}</span>
                  <div>
                      <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                      <button onclick="deleteTask(${index})">Delete</button>
                  </div>
              `;
              taskList.appendChild(taskItem);
          }
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
      updateTaskCount();
  }

  addTaskBtn.addEventListener('click', function() {
      const taskText = taskInput.value.trim();
      if (taskText !== '') {
          tasks.push({ text: taskText, completed: false });
          taskInput.value = '';
          renderTasks();
      }
  });

  window.toggleComplete = function(index) {
      tasks[index].completed = !tasks[index].completed;
      renderTasks();
  };

  window.editTask = function(index) {
      const taskTextElement = document.querySelector(`li:nth-child(${index + 1}) .task-text`);
      const originalText = taskTextElement.textContent;

      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = originalText;
      editInput.className = 'edit-input';

      taskTextElement.replaceWith(editInput);

      editInput.addEventListener('blur', function() {
          const newTaskText = editInput.value.trim();
          if (newTaskText) {
              tasks[index].text = newTaskText;
          }
          renderTasks();
      });

      editInput.addEventListener('keypress', function(event) {
          if (event.key === 'Enter') {
              editInput.blur();
          }
      });

      editInput.focus();
  };

  window.deleteTask = function(index) {
      tasks.splice(index, 1);
      renderTasks();
  };

  filterButtons.forEach(button => {
      button.addEventListener('click', function() {
          renderTasks(this.getAttribute('data-filter'));
      });
  });

  renderTasks();
});

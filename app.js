import { addStudyTask, completeStudyTask, getDailyStudyMinutes, getTaskStats } from './planner.js';

const STORAGE_KEY = 'study-helpoo-tasks';
const dateInput = document.querySelector('#due-date');
const taskForm = document.querySelector('#task-form');
const taskList = document.querySelector('#task-list');
const taskTemplate = document.querySelector('#task-template');
const emptyState = document.querySelector('#empty-state');
const clearAllButton = document.querySelector('#clear-all');

loadDate();
loadTasks();

dateInput.value = new Date().toISOString().slice(0, 10);

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(taskForm);
  const newTask = {
    subject: formData.get('subject'),
    title: formData.get('title'),
    duration: formData.get('duration'),
    dueDate: formData.get('dueDate'),
  };

  const tasks = addStudyTask(loadTasksFromStorage(), newTask);
  saveTasks(tasks);
  renderTasks(tasks);
  taskForm.reset();
  dateInput.value = new Date().toISOString().slice(0, 10);
});

taskList.addEventListener('click', (event) => {
  const completeButton = event.target.closest('.task-complete');
  const deleteButton = event.target.closest('.task-delete');
  const taskElement = event.target.closest('.task-item');

  if (!taskElement) return;

  if (completeButton) {
    completeTask(taskElement.dataset.taskId);
  } else if (deleteButton) {
    deleteTask(taskElement.dataset.taskId);
  }
});

clearAllButton.addEventListener('click', () => {
  const tasks = loadTasksFromStorage().filter((task) => !task.completed);
  saveTasks(tasks);
  renderTasks(tasks);
});

function loadTasks() {
  renderTasks(loadTasksFromStorage());
}

function loadTasksFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function completeTask(taskId) {
  const tasks = completeStudyTask(loadTasksFromStorage(), taskId);
  saveTasks(tasks);
  renderTasks(tasks);
}

function deleteTask(taskId) {
  const tasks = loadTasksFromStorage().filter((task) => task.id !== taskId);
  saveTasks(tasks);
  renderTasks(tasks);
}

function renderTasks(tasks) {
  const today = new Date().toISOString().slice(0, 10);
  const nowShowing = tasks.filter((task) => task.dueDate === today);
  const stats = getTaskStats(tasks);
  const dailyMinutes = getDailyStudyMinutes(tasks, today);
  const dailyTarget = 90;
  const completionPercent = Math.min(100, Math.round((dailyMinutes / dailyTarget) * 100));

  taskList.replaceChildren();
  nowShowing.forEach((task) => {
    const item = taskTemplate.content.cloneNode(true);
    const article = item.querySelector('.task-item');
    const subject = item.querySelector('.task-subject');
    const title = item.querySelector('h4');
    const meta = item.querySelector('.task-meta');

    article.dataset.taskId = task.id;
    article.classList.toggle('completed', task.completed);
    subject.textContent = task.subject;
    title.textContent = task.title;
    meta.textContent = `${task.duration} minutes • ${formatDate(task.dueDate)}`;

    if (task.completed) {
      article.querySelector('.task-complete').setAttribute('aria-label', 'Task complete');
    }

    taskList.append(item);
  });

  emptyState.hidden = nowShowing.length > 0;
  document.querySelector('#daily-minutes').textContent = String(dailyMinutes);
  document.querySelector('#progress-label').textContent = `${completionPercent}% of your plan complete`;
  document.querySelector('#total-tasks').textContent = String(stats.total);
  document.querySelector('#completed-tasks').textContent = String(stats.completed);
  document.querySelector('#remaining-tasks').textContent = String(stats.remaining);
  document.querySelector('#total-minutes').textContent = String(stats.totalMinutes);
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${dateString}T12:00:00`));
}

function loadDate() {
  document.querySelector('#date-label').textContent = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
}

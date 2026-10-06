export function createTaskId() {
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function addStudyTask(tasks, task) {
  const normalized = { ...task };
  const subject = normalized.subject?.trim() || 'General';
  const title = normalized.title?.trim() || 'Untitled study task';
  const duration = Number(normalized.duration) || 30;
  const dueDate = normalized.dueDate || new Date().toISOString().slice(0, 10);

  return [
    ...tasks,
    {
      id: normalized.id || createTaskId(),
      subject,
      title,
      duration: Math.max(5, Math.min(duration, 240)),
      completed: false,
      dueDate,
      completedAt: '',
    },
  ];
}

export function completeStudyTask(tasks, taskId) {
  return tasks.map((task) => {
    if (task.id !== taskId) return task;

    return {
      ...task,
      completed: true,
      completedAt: new Date().toISOString(),
    };
  });
}

export function getDailyStudyMinutes(tasks, date) {
  return tasks
    .filter((task) => task.dueDate === date && task.completed)
    .reduce((total, task) => total + Number(task.duration || 0), 0);
}

export function getTaskStats(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  const totalMinutes = tasks.reduce((total, task) => total + Number(task.duration || 0), 0);
  const completedMinutes = tasks
    .filter((task) => task.completed)
    .reduce((total, task) => total + Number(task.duration || 0), 0);

  return {
    total: tasks.length,
    completed,
    remaining: tasks.length - completed,
    totalMinutes,
    completedMinutes,
  };
}

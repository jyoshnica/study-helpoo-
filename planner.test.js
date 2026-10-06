import test from 'node:test';
import assert from 'node:assert/strict';
import { addStudyTask, completeStudyTask, getDailyStudyMinutes, getTaskStats } from './planner.js';

test('adds a task with a default duration and today due date', () => {
  const tasks = addStudyTask([], {
    subject: 'Math',
    title: 'Practice algebra',
  });

  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].subject, 'Math');
  assert.equal(tasks[0].title, 'Practice algebra');
  assert.equal(tasks[0].duration, 30);
  assert.equal(tasks[0].completed, false);
  assert.equal(tasks[0].dueDate, new Date().toISOString().slice(0, 10));
});

test('marks a task complete without removing it', () => {
  const tasks = [
    { id: 'task-1', subject: 'Science', title: 'Read chapter', duration: 45, completed: false, dueDate: '2026-10-06' },
  ];

  const updated = completeStudyTask(tasks, 'task-1');

  assert.equal(updated[0].completed, true);
  assert.equal(updated[0].completedAt.length > 0, true);
});

test('calculates daily study minutes from completed tasks', () => {
  const tasks = [
    { id: 'task-1', subject: 'Math', duration: 30, completed: true, dueDate: '2026-10-06' },
    { id: 'task-2', subject: 'History', duration: 45, completed: true, dueDate: '2026-10-06' },
    { id: 'task-3', subject: 'Math', duration: 20, completed: false, dueDate: '2026-10-06' },
  ];

  assert.equal(getDailyStudyMinutes(tasks, '2026-10-06'), 75);
});

test('summarizes subject and completion statistics', () => {
  const tasks = [
    { id: 'task-1', subject: 'Math', duration: 30, completed: true, dueDate: '2026-10-06' },
    { id: 'task-2', subject: 'Math', duration: 30, completed: false, dueDate: '2026-10-06' },
    { id: 'task-3', subject: 'Science', duration: 60, completed: true, dueDate: '2026-10-06' },
  ];

  assert.deepEqual(getTaskStats(tasks), {
    total: 3,
    completed: 2,
    remaining: 1,
    totalMinutes: 120,
    completedMinutes: 90,
  });
});

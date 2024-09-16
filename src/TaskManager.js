import React, { useMemo, useState } from 'react';
import { TaskScheduler } from './TaskScheduler';
import { createNewTask, TIMEOUT_DURATION } from './utils';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskDuration, setNewTaskDuration] = useState('');
  const taskRunner = useMemo(() => new TaskScheduler(TIMEOUT_DURATION), []);
  // const taskRunner = new TaskScheduler(TIMEOUT_DURATION);

  const updateTaskStatus = (taskId, status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
  };

  const createAndQueueNewTask = () => {
    const newTask = createNewTask(newTaskDuration);
    taskRunner.enqueue(
      (onComplete, onError) => {
        setTimeout(() => {
          onComplete();
        }, newTask.duration * 1_000);
      },
      (status) => updateTaskStatus(newTask.id, status)
    );

    return newTask;
  };

  return (
    <div className="p-4 flex gap-4">
      <div className="flex-1">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <div className="flex-none flex gap-4">
            <input
              type="number"
              placeholder="Add Task Duration..."
              className="border rounded px-2 py-1"
              value={newTaskDuration}
              onChange={(e) => setNewTaskDuration(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (Number(newTaskDuration)) {
                    setTasks((prev) => [...prev, createAndQueueNewTask()]);
                    setNewTaskDuration('');
                  }
                }
              }}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                if (Number(newTaskDuration)) {
                  setTasks((prev) => [...prev, createAndQueueNewTask()]);
                  setNewTaskDuration('');
                }
              }}
            >
              Add Task
            </button>
          </div>
        </header>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Duration</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                data-testid={`task-row-${task.id}`}
                className="cursor-pointer"
              >
                <td className="py-2 px-4 border-b" data-cell-type="id">
                  {task.id}
                </td>
                <td className="py-2 px-4 border-b" data-cell-type="title">
                  {task.duration}s
                </td>
                <td className="py-2 px-4 border-b" data-cell-type="status">
                  {task.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManager;

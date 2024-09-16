import React, { useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { TaskScheduler } from './TaskScheduler';
import { createNewTask, TIMEOUT_DURATION } from './utils';

const TaskManager = ({ timeoutDuration = TIMEOUT_DURATION }) => {
  const [tasks, setTasks] = useState([]);
  const taskRunner = useMemo(() => new TaskScheduler(timeoutDuration), []);
  // const taskRunner = new TaskScheduler(TIMEOUT_DURATION);

  const updateTaskStatus = (taskId, status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
  };

  return (
    <div className="p-4 flex gap-4">
      <div className="flex-1">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Pipelines</h1>
          <div className="flex-none flex gap-4 items-center flex">
            <span>Timeout Duration: {TIMEOUT_DURATION / 1_000}s</span>
            {[1000, 3000, 5000].map((timeDuration) => (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  const newTask = createNewTask(timeDuration);
                  flushSync(() => {
                    setTasks((prev) => [...prev, newTask]);
                  });
                  taskRunner.enqueue(
                    (onComplete) => {
                      setTimeout(() => {
                        onComplete();
                      }, newTask.duration);
                    },
                    (status) => {
                      updateTaskStatus(newTask.id, status);
                    }
                  );
                }}
              >
                Add Pipeline ({timeDuration}s)
              </button>
            ))}
          </div>
        </header>
        <table className="min-w-full bg-white border table-fixed border-collapse w-full">
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

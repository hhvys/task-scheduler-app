import React, { useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { TaskScheduler } from './TaskScheduler';
import { createNewPipeline, TIMEOUT_DURATION } from './utils';

const PipelinesManager = ({ timeoutDuration = TIMEOUT_DURATION }) => {
  const [pipelines, setPipelines] = useState([]);
  const taskRunner = useMemo(() => new TaskScheduler(timeoutDuration, 1), []);
  // const taskRunner = new TaskScheduler(TIMEOUT_DURATION);

  const updatePipelineStatus = (pipelineId, status) => {
    setPipelines((prev) =>
      prev.map((p) => (p.id === pipelineId ? { ...p, status } : p))
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
                  const newPipeline = createNewPipeline(timeDuration);
                  flushSync(() => {
                    setPipelines((prev) => [...prev, newPipeline]);
                  });
                  taskRunner.enqueue(
                    (onComplete) => {
                      setTimeout(() => {
                        onComplete();
                      }, newPipeline.duration);
                    },
                    (status) => {
                      updatePipelineStatus(newPipeline.id, status);
                    }
                  );
                }}
              >
                Add Pipeline ({timeDuration / 1000}s)
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
            {pipelines.map((pipeline, index) => (
              <tr
                key={pipeline.id}
                data-testid={`p-row-${index}`}
                className="cursor-pointer"
              >
                <td
                  className="py-2 px-4 border-b"
                  data-cell-type="id"
                  data-testid={`p-id-${index}`}
                >
                  {pipeline.id}
                </td>
                <td
                  className="py-2 px-4 border-b"
                  data-cell-type="title"
                  data-testid={`p-duration-${index}`}
                >
                  {pipeline.duration / 1000}s
                </td>
                <td
                  className="py-2 px-4 border-b"
                  data-cell-type="status"
                  data-testid={`p-status-${index}`}
                >
                  {pipeline.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PipelinesManager;

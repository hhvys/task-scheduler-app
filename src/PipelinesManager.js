import React, { useState } from 'react';
import { TaskScheduler } from './TaskScheduler';
import { createNewPipeline, TIMEOUT_DURATION } from './utils';

const PipelinesManager = ({ timeoutDuration = TIMEOUT_DURATION }) => {
  const [pipelines, setPipelines] = useState([]);
  const taskRunner = new TaskScheduler(timeoutDuration);

  return (
    <div className="p-4 flex gap-4">
      <div className="flex-1">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">Pipelines</h1>
          <div className="flex justify-between items-center mb-4">
            <div className="flex-none flex gap-4 items-center flex">
              <span>Timeout Duration: {timeoutDuration / 1_000}s</span>
              {[1000, 3000, 5000].map((pipeDuration) => (
                <button
                  key={pipeDuration}
                  className="bg-blue-500 text-white p-1 rounded"
                  data-testid={`add-pipeline-${pipeDuration}`}
                  onClick={() => {
                    setPipelines((prev) => [
                      ...prev,
                      createNewPipeline(pipeDuration),
                    ]);
                  }}
                >
                  Add ({pipeDuration / 1000}s)
                </button>
              ))}
            </div>
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
                data-testid={`p-row-${index + 1}`}
                className="cursor-pointer"
              >
                <td
                  className="py-2 px-4 border-b"
                  data-cell-type="id"
                  data-testid={`p-id-${index + 1}`}
                >
                  {pipeline.id}
                </td>
                <td
                  className="py-2 px-4 border-b"
                  data-cell-type="title"
                  data-testid={`p-duration-${index + 1}`}
                >
                  {pipeline.duration / 1000}s
                </td>
                <td
                  className="py-2 px-4 border-b"
                  data-cell-type="status"
                  data-testid={`p-status-${index + 1}`}
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

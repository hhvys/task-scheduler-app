/*
 * TaskRunner
 *
 1. **Immediate Execution:** If there are no tasks in the queue, the task execution should start immediately.
 2. **Sequential Execution:** Tasks should be performed sequentially. At any point in time, no more than one task should run.
 3. **Callback Invocation:** The callback should be invoked with a `Result({data, error})` object.
 4. **Timeout Handling:** If a task takes more than 2 seconds, invoke the callback with a **TIMEOUT** error.
 5. **Retry Mechanism:** In case of a TIMEOUT, retry the task execution twice or until the task is completed/failed, whichever comes first.
 *
 */

// type Task = (complete: (data: string) => void, fail: (reason: string) => void) => void;
// type TaskResult = { data: string; error: string };

import { STATUS } from './utils';

export class TaskScheduler {
  constructor(timeoutDuration) {
    this.queue = [];
    this.isRunning = false;
    this.timeoutDuration = timeoutDuration;
  }

  enqueue(task, callback) {
    this.queue.push({ task, callback });

    if (!this.isRunning) {
      this.runNext();
    }
  }

  runNext() {
    if (this.queue.length === 0) {
      this.isRunning = false;
      return;
    }

    this.isRunning = true;
    const { task, callback } = this.queue.shift();
    callback(STATUS.IN_PROGRESS);
    this.executeTask(task, callback, 0);
  }

  executeTask(task, callback, retries) {
    let timeoutId;
    let hasTimedOut = false;

    const complete = () => {
      if (!hasTimedOut) {
        clearTimeout(timeoutId);
        callback(STATUS.COMPLETED);
        this.runNext();
      }
    };

    const fail = () => {
      if (!hasTimedOut) {
        clearTimeout(timeoutId);
        callback(STATUS.ERROR);
        this.runNext();
      }
    };

    // Set timeout for the task (2 seconds)
    timeoutId = setTimeout(() => {
      hasTimedOut = true;

      if (retries < 1) {
        // Retry the task if retries are available
        callback(STATUS.RETRY);
        this.executeTask(task, callback, retries + 1);
      } else {
        // Invoke the callback with a TIMEOUT error after the last retry
        callback(STATUS.TIMEOUT);
        this.runNext();
      }
    }, this.timeoutDuration);

    // Start the task
    task(
      (data) => {
        if (!hasTimedOut) complete(data);
      },
      (error) => {
        if (!hasTimedOut) fail(error);
      }
    );
  }
}

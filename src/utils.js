export const STATUS = {
  QUEUE: 'QUEUE',
  IN_PROGRESS: 'IN_PROGRESS',
  RETRY: 'RETRY',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
  TIMEOUT: 'TIMEOUT',
};

export const TIMEOUT_DURATION = 4000;

let id = 1;
export const createNewTask = (duration) => ({
  id: id++,
  duration,
  status: STATUS.QUEUE,
});

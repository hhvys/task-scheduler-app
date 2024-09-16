export const STATUS = {
  QUEUE: 'QUEUE',
  IN_PROGRESS: 'IN_PROGRESS',
  RETRY: 'RETRY',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
  TIMEOUT: 'TIMEOUT',
};

export const TIMEOUT_DURATION = 3500;

let id = 1;
export const createNewPipeline = (duration) => ({
  id: id++,
  duration,
  status: STATUS.QUEUE,
});

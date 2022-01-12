export const getIsDevelopment = (): boolean => {
  return ['development', 'local'].includes(getStage());
};

export const getMainStreamName = (): string => {
  return process.env.MAIN_STREAM_NAME || 'unknown';
};

export const getStage = (): string => {
  return process.env.STAGE || 'unknown';
};

export const millisToMinutesAndSeconds = (millis: number) => {
  const seconds = Math.floor((millis / 1000) % 60);
  const minutes = Math.floor((millis / 1000 / 60) % 60);

  const getSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${getSeconds}`;
};

// Get year from YYYY-MM-DD
export const getYear = (date: string) => date.split('-')[0];

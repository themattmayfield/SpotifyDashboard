export function formatDuration(millis: number) {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

const numberFormat = new Intl.NumberFormat('en-US');
export const formatNumber = (value: number) => numberFormat.format(value);

export const formatCount = (count: number, noun: string) =>
  `${formatNumber(count)} ${count === 1 ? noun : `${noun}s`}`;

export function calculateDashOffset(time: number): number {
  const period = 9000; 
  const min = -256;
  const max = 256;
  const range = max - min;
  const t = (time % period) / period;
  return max - (range * t);
}

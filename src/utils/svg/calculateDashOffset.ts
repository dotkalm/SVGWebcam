/**
 * Calculate looping dash offset based on time
 * Animates continuously in one direction
 */
export function calculateDashOffset(time: number): number {
  const period = 35000; // 5 second cycle
  const min = -256;
  const max = 256;
  const range = max - min;
  
  // Normalize time to 0-1 range within period
  const t = (time % period) / period;
  
  // Linear progression from max to min (loops back)
  return max - (range * t);
}

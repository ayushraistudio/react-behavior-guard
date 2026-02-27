/**
 * Adds a penalty to the current score and ensures it doesn't exceed 100.
 * @param currentScore The current risk score
 * @param penalty The weight of the detected suspicious activity
 * @returns Updated score capped at 100
 */
export const calculateScore = (currentScore: number, penalty: number): number => {
  return Math.min(currentScore + penalty, 100);
};
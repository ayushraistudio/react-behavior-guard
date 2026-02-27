export const calculateScore = (currentScore: number, penalty: number): number => {
  return Math.min(currentScore + penalty, 100);
};
const calibrateCoef = 1;
//for 3 days of training
export const musclesRefs = [
  { name: 'coxa anterior', loadRefPerTrainning: calibrateCoef * 958 },
  { name: 'coxa posterior', loadRefPerTrainning: calibrateCoef * 838 },
  { name: 'peito', loadRefPerTrainning: calibrateCoef * 239 },
  { name: 'costas superior', loadRefPerTrainning: calibrateCoef * 381 },
  { name: 'ombro', loadRefPerTrainning: calibrateCoef * 1028 },
  { name: 'panturrilha', loadRefPerTrainning: calibrateCoef * 301 },
  { name: 'biceps', loadRefPerTrainning: calibrateCoef * 150 },
  { name: 'triceps', loadRefPerTrainning: calibrateCoef * 309 },
  { name: 'abdominal', loadRefPerTrainning: calibrateCoef * 831 },
  { name: 'costas inferior', loadRefPerTrainning: calibrateCoef * 438 },
  { name: 'gluteos', loadRefPerTrainning: calibrateCoef * 779 },
];

const template = {
  74: {
    id: 74,
    name: 'Squat Medball Clean',
    complexity: 3,
    musclesTargeted: [
      { name: 'coxa anterior', impact: 1 },
      { name: 'coxa posterior', impact: 1 },
      { name: 'peito', impact: 1 },
      { name: 'ombro', impact: 1 },
      { name: 'panturrilha', impact: 1 },
      { name: 'biceps', impact: 1 },
      { name: 'triceps', impact: 1 },
      { name: 'abdominal', impact: 1 },
      { name: 'costas inferior', impact: 1 },
      { name: 'costas superior', impact: 1 },
      { name: 'gluteos', impact: 1 },
    ],
    timePerRepInS: 2,
    blocks: ['Warm Up', 'Skill', 'WOD'],
  },
};

const calibrateCoef = 2;
export const musclesRefs = [
  { name: 'coxa anterior', loadRefPerTrainning: calibrateCoef * 240 },
  { name: 'coxa posterior', loadRefPerTrainning: calibrateCoef * 200 },
  { name: 'peito', loadRefPerTrainning: calibrateCoef * 200 },
  { name: 'costas superior', loadRefPerTrainning: calibrateCoef * 200 },
  { name: 'ombro', loadRefPerTrainning: calibrateCoef * 130 },
  { name: 'panturrilha', loadRefPerTrainning: calibrateCoef * 80 },
  { name: 'biceps', loadRefPerTrainning: calibrateCoef * 150 },
  { name: 'triceps', loadRefPerTrainning: calibrateCoef * 150 },
  { name: 'abdominal', loadRefPerTrainning: calibrateCoef * 150 },
  { name: 'costas inferior', loadRefPerTrainning: calibrateCoef * 80 },
  { name: 'gluteos', loadRefPerTrainning: calibrateCoef * 140 },
];

//CHANGE NAMES TO PT NAMES
// POPULATE EXERICSE MUSCLE IMPACT ON USER CREATION
// create indexes for fields used in filters such as coach id

const calibrateCoef = 2;
export const musclesRefs = [
  { name: "front thigh", loadRefPerTrainning: calibrateCoef * 240 },
  { name: "back thigh", loadRefPerTrainning: calibrateCoef * 200 },
  { name: "chest", loadRefPerTrainning: calibrateCoef * 200 },
  { name: "upper back", loadRefPerTrainning: calibrateCoef * 200 },
  { name: "shoulder", loadRefPerTrainning: calibrateCoef * 130 },
  { name: "calf", loadRefPerTrainning: calibrateCoef * 80 },
  { name: "biceps", loadRefPerTrainning: calibrateCoef * 150 },
  { name: "triceps", loadRefPerTrainning: calibrateCoef * 150 },
  { name: "abs", loadRefPerTrainning: calibrateCoef * 150 },
  { name: "lower back", loadRefPerTrainning: calibrateCoef * 80 },
  { name: "glutes", loadRefPerTrainning: calibrateCoef * 140 },
];

// TODO
//INSERT TRANSACTION ON USER CREATION
//SEED DOMAIN TABLES ON MIGRATIONS
//
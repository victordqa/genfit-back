export type CreateCoachParams = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type CreateBoxParams = {
  name: string;
  coachId: number;
};

export type CreateCoachLogin = {
  email: string;
  id: string;
};

export type UserPayload = {
  sub: number;
  email: string;
};

export type SuggestTrainningParams = {
  boxId: number;
  quantity: number;
  coachId;
};

export type CreateTrainningParams = {
  boxId: number;
  quantity: number;
};

export type TrainningExerciseData = {
  exercises: {
    id: number;
    reps: number;
    load: number;
  }[];
  durationInM: number;
  modifier: string;
};
export type TrainningForCalc = {
  warmUp: TrainningExerciseData;
  skill: TrainningExerciseData;
  wod: TrainningExerciseData;
};

export type ExerciseForCalc = {
  id: number;
  name: string;
  complexity: number;
  musclesTargeted: {
    name: string;
    impact: number;
  }[];
  timePerRepInS: number;
  blocks: string[];
};

export type AccumulatedLoads = {
  [index: string]: number;
};

export type MusclesRefs = { name: string; loadRefPerTrainning: number }[];
export type MaxExParams = { name: string; maxImpact: number }[];
export type ParsedModifiers = {
  [key: string]: { maxCandidates: number; minCandidates: number };
};

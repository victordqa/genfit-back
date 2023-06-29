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
  coachId: number;
  quantity: number;
};

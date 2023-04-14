export type CreateCoachParams = {
  name: string;
  email: string;
  password: string;
};

export type CreateBoxParams = {
  name: string;
  coachId: number;
};

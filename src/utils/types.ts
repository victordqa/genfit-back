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

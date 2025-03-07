export type SignUpData = {
  emailId: string;
  password: string;
  userName: string;
};

export type SignInData = {
  userName: string;
  password: string;
};

export type SignInResponse = {
  userName: string;
  token: string;
  userId: number;
};

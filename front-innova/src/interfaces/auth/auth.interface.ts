export interface User {
  token: string;
  email: string;
  id: string;
  role: string;
}

export interface Session {
  data: {
    user: User;
  };
}

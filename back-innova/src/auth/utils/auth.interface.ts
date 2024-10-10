export interface User {
  id: number;
  email: string;
  role: string;
  password?: string;
}

export interface Payload {
  email: string;
  sub: number;
  role: string;
}

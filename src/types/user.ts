export type TUser = {
  id: string;
  email: string;
  name: string;
  image: string;
  role?: string; // "user" または "admin"
  createdAt?: Date;
  updatedAt?: Date;
};

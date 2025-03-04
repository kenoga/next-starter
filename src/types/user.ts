export type TUser = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  role?: string | null; // "user" または "admin"
  createdAt?: Date;
  updatedAt?: Date;
};

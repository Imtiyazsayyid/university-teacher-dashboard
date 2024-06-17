export type Admin = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  profileImg: string | null;
  address: string | null;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};

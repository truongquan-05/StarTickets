
export interface Genre {
  id: number;
  name: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar: string; 
  role: "admin" | "user";
  isActive: boolean;
}
export type Food = {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
  status: boolean;
  description?: string;
  deleted?: boolean;
};

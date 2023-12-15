import { UserData, UserRole } from "~types";

export interface SerializeStateType {
  isAuthenticated: boolean;
  user: UserData | null;
  role: UserRole | null;
}

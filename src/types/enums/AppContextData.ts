import { Users } from "../dto/users/Users";

export default interface AppContextData {
  user: Users | null;
  setUser: (user: Users | null) => void;
  loading: boolean;
  userId: number;
  setUserId: (id: number) => void;
}

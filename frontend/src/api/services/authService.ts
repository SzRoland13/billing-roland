import { useUserStore } from "../../store/userStore";

export const login = (username: string, password: string) => {
  return useUserStore.getState().login(username, password);
};

export const logout = () => {
  useUserStore.getState().clearUser();
};

export const register = async (
  name: string,
  username: string,
  password: string,
  role: string
) => {
  return useUserStore.getState().register(name, username, password, role);
};

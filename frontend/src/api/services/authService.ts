import { useUserStore } from "../../store/userStore";

export const login = (
  username: string,
  password: string,
  sessionId?: string,
  captchaResponse?: string
) => {
  return useUserStore
    .getState()
    .login(username, password, sessionId, captchaResponse);
};

export const logout = () => {
  useUserStore.getState().clearUser();
};

export const register = async (
  name: string,
  username: string,
  password: string,
  roleName: string
) => {
  return useUserStore.getState().register(name, username, password, roleName);
};

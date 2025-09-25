import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import axiosClient from "../api/axiosClient";

interface UserState {
  name: string | null;
  username: string | null;
  roles: string[];
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (data: Partial<UserState>) => void;
  clearUser: () => void;
  login: (username: string, password: string) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  register: (
    name: string,
    username: string,
    password: string,
    roleName: string
  ) => Promise<void>;
}

export const useUserStore = create(
  persist(
    immer<UserState>((set, get) => ({
      name: null,
      username: null,
      roles: [],
      accessToken: null,
      refreshToken: null,

      setUser: (data) => set((state) => Object.assign(state, data)),
      clearUser: () =>
        set(() => ({
          username: null,
          roles: [],
          accessToken: null,
          refreshToken: null,
        })),

      login: async (username, password) => {
        const res = await axiosClient.post("/auth/login", {
          username,
          password,
        });
        set((state) => {
          state.name = res.data.user.name;
          state.username = username;
          state.roles = res.data.user.roles || [];
          state.accessToken = res.data.tokens.accessToken;
          state.refreshToken = res.data.tokens.refreshToken;
        });
      },

      refreshAccessToken: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) throw new Error("No refresh token");
        const res = await axiosClient.post("/auth/refresh", { refreshToken });
        set((state) => {
          state.accessToken = res.data.accessToken;
        });
      },
      register: async (name, username, password, roleName) => {
        const res = await axiosClient.post("/auth/register", {
          name,
          username,
          password,
          roleName,
        });
        set((state) => {
          state.name = name;
          state.username = username;
          state.roles = [roleName];
          state.accessToken = res.data.tokens.accessToken;
          state.refreshToken = res.data.tokens.refreshToken;
        });
      },
    })),
    {
      name: "user-storage",
    }
  )
);

export const getAccessToken = () => useUserStore.getState().accessToken;
export const refreshAccessToken = () =>
  useUserStore.getState().refreshAccessToken();

// src/store/adminStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axiosClient from "../api/axiosClient";
import type { User, Role } from "../utils/types";

interface AdminState {
  users: User[];
  roles: Role[];
  totalPages: number;
  page: number;
  size: number;
  fetchUsers: (page?: number, size?: number) => Promise<void>;
  fetchRoles: () => Promise<void>;
  updateUserRoles: (userId: number, roleIds: number[]) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
}

export const useAdminStore = create(
  immer<AdminState>((set) => ({
    users: [],
    roles: [],
    totalPages: 0,
    page: 0,
    size: 10,

    fetchUsers: async (page = 0, size = 10) => {
      const res = await axiosClient.get("/users", {
        params: { page, size },
      });
      set((state) => {
        state.users = res.data.content;
        state.totalPages = res.data.totalPages;
        state.page = page;
        state.size = size;
      });
    },

    fetchRoles: async () => {
      const res = await axiosClient.get("/roles");
      set((state) => {
        state.roles = res.data;
      });
    },

    updateUserRoles: async (userId, roleIds) => {
      await axiosClient.put(`/users/${userId}/roles`, roleIds);
      set((state) => {
        const user = state.users.find((u) => u.id === userId);
        if (user) {
          user.roles = state.roles.filter((r) => roleIds.includes(r.id));
        }
      });
    },

    deleteUser: async (userId) => {
      await axiosClient.delete(`/users/${userId}`);
      set((state) => {
        state.users = state.users.filter((u) => u.id !== userId);
      });
    },
  }))
);

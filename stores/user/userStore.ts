// stores/user/user.ts
import { defineStore } from "pinia";

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import type { User } from "~/types/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    roles: [] as string[],
    permissions: [] as string[],
  }),

  actions: {
    setUser(data: User) {
      this.user = data;
    },
    setRoles(roles: string[]) {
      this.roles = roles;
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions;
    },
    updateUserName(newName: string) {
      if (this.user) {
        this.user.name = newName;
      }
    },

    clear() {
      this.user = null;
      this.roles = [];
      this.permissions = [];
    },
  },

  getters: {
    isAuthenticated(): boolean {
      return this.user !== null;
    },

    getRoles(): string[] {
      return this.roles;
    },

    getPermissions(): string[] {
      return this.permissions;
    },

    hasRole(): (role: string) => boolean {
      return (role) => this.roles.includes(role);
    },

    hasPermission(): (permission: string) => boolean {
      return (permission) => this.permissions.includes(permission);
    },
  },

  persist: true,
});

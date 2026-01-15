/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { IUser } from "@/models/User";
interface UserState {
  users: IUser[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  updateUser: (userId: string, updates: Partial<IUser>) => Promise<void>;
  registerUser: (telegramData: any) => Promise<IUser | null>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch users.");
      }
      const data = await response.json();
      set({ users: data.data, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching users:", error);
      set({
        error: error.message || "An unexpected error occurred.",
        isLoading: false,
      });
    }
  },

  updateUser: async (userId: string, updates: Partial<IUser>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Failed to update user ${userId}.`);
      }

      const data = await response.json();
      set((state) => ({
        users: state.users.map(
          // Ensure _id is correctly compared (it's a Mongoose ObjectId, so toString() is good)
          (user) =>
            user._id?.toString() === userId ? { ...user, ...data.data } : user
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error(`Error updating user ${userId}:`, error);
      set({
        error: error.message || "An unexpected error occurred.",
        isLoading: false,
      });
    }
  },

  // New action to register/update user on first app load
  registerUser: async (telegramData: any) => {
    set({ isLoading: true, error: null }); 
    try {
      const payload = {
        telegramId: telegramData.id,
        firstName: telegramData.first_name,
        lastName: telegramData.last_name || undefined, 
        username: telegramData.username || undefined,
        languageCode: telegramData.language_code || undefined,
        photoUrl: telegramData.photo_url || undefined,
        telegramData: telegramData, // Store the raw data
      };

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to register/update user.");
      }

      const data = await response.json();
      set((state) => {
        const existingUserIndex = state.users.findIndex(
          (u) => u.telegramId === data.data.telegramId
        );
        if (existingUserIndex > -1) {
          const updatedUsers = [...state.users];
          updatedUsers[existingUserIndex] = {
            ...updatedUsers[existingUserIndex],
            ...data.data,
          };
          return { users: updatedUsers, isLoading: false };
        } else {
          return { users: [...state.users, data.data], isLoading: false };
        }
      });
      return data.data; 
    } catch (error: any) {
      console.error("Error registering/updating user:", error);
      set({
        error:
          error.message ||
          "An unexpected error occurred during user registration.",
        isLoading: false,
      });
      return null; 
    }
  },
}));

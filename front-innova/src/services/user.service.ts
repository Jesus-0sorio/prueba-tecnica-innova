import { User } from "@/interfaces/user/user.interface";
import { endpoints } from "@/utils/api.config"

export const userService = {
  getUsers: async (token: string) => {
    try {
      const response = await fetch(endpoints.user.getUsers, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        return response.json();
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  getUsersByRole: async (role: string, token: string) => {
    try {
      const response = await fetch(`${endpoints.user.getUsersByRole}/${role}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        return response.json();
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  updateUser: async (user: User, token: string) => {
    try {
      const response = await fetch(endpoints.user.updateUser, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (response.status === 200) {
        return response.json();
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  deleteUser: async (id: string, token: string) => {
    try {
      const response = await fetch(`${endpoints.user.deleteUser}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204)
        return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};
import { endpoints } from "@/utils/api.config";

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(endpoints.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
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

  register: async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    try {
      const response = await fetch(endpoints.auth.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      if (response.status === 201) {
        return response.json();
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

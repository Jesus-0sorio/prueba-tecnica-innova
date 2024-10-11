import { Task, TaskServiceProps } from "@/interfaces/task/task.interface";
import { endpoints } from "@/utils/api.config";

export const taskService = {
  getTasks: async (token: string) => {
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      const response = await fetch(endpoints.task.getTasks, {
        headers,
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
  getMyTasks: async ({ token }: TaskServiceProps) => {
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      const response = await fetch(endpoints.task.getMyTasks, {
        headers,
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
  createTask: async (task: Task, token: string) => {
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      headers.append("Content-Type", "application/json");

      const response = await fetch(endpoints.task.createTask, {
        method: "POST",
        headers,
        body: JSON.stringify(task),
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
  updateTask: async (task: Partial<Task>, token: string) => {
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      headers.append("Content-Type", "application/json");

      const response = await fetch(`${endpoints.task.updateTask}/${task.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(task),
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
  updateVariousTasks: async (tasks: Task[], token: string) => {
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      headers.append("Content-Type", "application/json");

      const response = await fetch(endpoints.task.updateTask, {
        method: "PUT",
        headers,
        body: JSON.stringify(tasks),
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

  deleteTask: async (id: number, token: string) => {
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      headers.append("Content-Type", "application/json");

      const response = await fetch(`${endpoints.task.deleteTask}/${id}`, {
        method: "DELETE",
        headers,
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
  DeleteVariousTasks: async (ids: number[], token: string) => {
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      headers.append("Content-Type", "application/json");

      const response = await fetch(endpoints.task.deleteTask, {
        method: "DELETE",
        headers,
        body: JSON.stringify(ids),
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
};

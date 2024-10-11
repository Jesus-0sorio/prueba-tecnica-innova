import { Project } from "@/interfaces/project/project.interface";
import { endpoints } from "@/utils/api.config";

export const projectService = {
  getProjects: async (token: string) => {
    try {
      console.log("token", token);
      const response = await fetch(endpoints.project.getProjects, {
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
  createProject: async (project: Project, token: string) => {
    try {
      const response = await fetch(endpoints.project.createProject, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(project),
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
  updateProject: async (project: Project, token: string) => {
    try {
      const response = await fetch(endpoints.project.updateProject, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(project),
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
  deleteProject: async (id: number, token: string) => {
    try {
      const response = await fetch(`${endpoints.project.deleteProject}/${id}`, {
        method: "DELETE",
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
};
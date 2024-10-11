const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log(process.env.NEXT_PUBLIC_JWT_SECRET);

export const endpoints = {
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
  },
  task: {
    getTasks: `${API_URL}/tasks`,
    getMyTasks: `${API_URL}/tasks/my`,
    createTask: `${API_URL}/tasks`,
    updateTask: `${API_URL}/tasks`,
    deleteTask: `${API_URL}/tasks`,
  },
  project: {
    getProjects: `${API_URL}/projects`,
    createProject: `${API_URL}/projects`,
    updateProject: `${API_URL}/projects`,
    deleteProject: `${API_URL}/projects`,
  },
  user: {
    getUsers: `${API_URL}/users`,
    getUsersByRole: `${API_URL}/users/role`,
    updateUser: `${API_URL}/users`,
    deleteUser: `${API_URL}/users`,
  },
};

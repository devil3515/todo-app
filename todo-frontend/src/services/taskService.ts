
import api from './api';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}

const taskService = {
  getAllTasks: async () => {
    const response = await api.get<Task[]>('/tasks/');
    return response.data;
  },
  
  getTask: async (id: number) => {
    const response = await api.get<Task>(`/tasks/${id}/`);
    return response.data;
  },
  
  createTask: async (taskData: CreateTaskData) => {
    const response = await api.post<Task>('/tasks/', taskData);
    return response.data;
  },
  
  updateTask: async (id: number, taskData: UpdateTaskData) => {
    const response = await api.put<Task>(`/tasks/${id}/`, taskData);
    return response.data;
  },
  
  deleteTask: async (id: number) => {
    const response = await api.delete(`/tasks/${id}/`);
    return response.data;
  },
  
  markAsCompleted: async (id: number, completed: boolean) => {
    const response = await api.patch<Task>(`/tasks/${id}/`, { completed });
    return response.data;
  },
  
  searchTasks: async (query: string) => {
    const response = await api.get<Task[]>(`/tasks/search/?q=${query}`);
    return response.data;
  },
};

export default taskService;

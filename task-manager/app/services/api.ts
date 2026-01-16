const API_BASE_URL = 'http://localhost:4000/api';

// ============= User API Calls =============

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  error?: string;
  token?: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('API login called with credentials:', credentials);
  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
};

export interface UserData {
  id: number;
  name: string;
  email: string;
}

export interface UsersResponse {
  success: boolean;
  data: UserData[];
}

// Get all users
export const getAllUsers = async (token: string): Promise<UserData[]> => {
  const response = await fetch(`${API_BASE_URL}/user/all`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log('getAllUsers response status:', response.status);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const result: UsersResponse = await response.json();
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  }
  return [];
};

// ============= Task API Calls =============

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigneeId: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: string;
  priority: string;
  assigneeId: number;
}

export interface TaskResponse {
  success: boolean;
  data?: Task | Task[];
  message?: string;
  error?: string;
}

// Create a new task
export const createTask = async (taskData: CreateTaskRequest, token: string): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  const result: TaskResponse = await response.json();
  if (result.success && result.data && !Array.isArray(result.data)) {
    return result.data;
  }
  throw new Error('Invalid response format');
};

// Get all tasks
export const getAllTasks = async (token: string): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/task`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  const result: TaskResponse = await response.json();
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  }
  return [];
};

// Get tasks by user ID
export const getTasksByUser = async (userId: number, token: string): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/task/user/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user tasks');
  }

  const result: TaskResponse = await response.json();
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  }
  return [];
};

// Get tasks by priority
export const getTasksByPriority = async (priority: string, token: string): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/task/priority=${priority}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  const result: TaskResponse = await response.json();
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  }
  return [];
};

// Delete a task
export const deleteTask = async (taskId: number, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
};

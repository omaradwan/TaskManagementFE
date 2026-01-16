'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';

import AuthPage from './components/auth/authPage';
import Header from './components/layout/Header';
import FilterPanel from './components/tasks/fllterPanel';
import TaskColumn from './components/tasks/taskColumn';
import TaskModal from './components/tasks/taskModal';

import { getAllTasks, createTask, deleteTask, getAllUsers, getTasksByUser, Task as APITask } from './services/api';

interface User {
  email: string;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  assigneeId?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Assignee {
  id: number;
  email: string;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
}

interface Errors {
  title?: string;
  assignee?: string;
}

export default function TaskManagementApp() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  
  const [availableAssignees, setAvailableAssignees] = useState<Assignee[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [token, setToken] = useState(''); 
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee: ''
  });
  
  const [errors, setErrors] = useState<Errors>({});

   useEffect(() => {
    const t = localStorage.getItem('authToken') || '';
    setToken(t);
  }, []);

   useEffect(() => {
    if (!token) return;

    const loadUsers = async () => {
      try {
        const users = await getAllUsers(token);
        setAvailableAssignees(users);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };

    loadUsers();
  }, [token]);

  // Hydration effect - check for stored user on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
    setIsHydrated(true);
  }, []);

  // Fetch tasks when user logs in
  useEffect(() => {
    if (currentUser) {
      const fetchTasks = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        setIsLoadingTasks(true);
        try {
          const apiTasks = await getAllTasks(token);
          // Transform API tasks to UI format
          const transformedTasks = apiTasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            assignee: task.name,
            assigneeId: task.assigneeId,
          }));
          setTasks(transformedTasks);
        } catch (error) {
          console.error('Failed to fetch tasks:', error);
          setTasks([]);
        } finally {
          setIsLoadingTasks(false);
        }
      };

      fetchTasks();
    }
  }, [currentUser]);

  
  
  const statuses = [
    { id: 'todo', label: 'To Do', color: 'bg-gray-100 border-gray-300' },
    { id: 'in-progress', label: 'In Progress', color: 'bg-blue-50 border-blue-300' },
    { id: 'done', label: 'Done', color: 'bg-green-50 border-green-300' }
  ];
  
  const priorities = ['low', 'medium', 'high'];
  
  
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };
  
  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.assignee.trim()) newErrors.assignee = 'Assignee is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      // Get the selected assignee ID from formData
      const assigneeId = parseInt(formData.assignee);
      if (isNaN(assigneeId)) {
        setErrors({ assignee: 'Please select a valid assignee' });
        return;
      }
      
      const taskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assigneeId: assigneeId,
      };

      if (editingTask) {
        // TODO: Implement update task API call
        setTasks(tasks.map(t => t.id === editingTask.id ? { ...formData, id: t.id } : t));
      } else {
        // Create new task via API
        const newTask = await createTask(taskData, token);
        const assigneeName = availableAssignees.find(a => a.id === assigneeId)?.name || 'Unknown';
        const transformedTask: Task = {
          id: newTask.id,
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          priority: newTask.priority,
          assignee: assigneeName,
          assigneeId: newTask.assigneeId,
        };
        setTasks([...tasks, transformedTask]);
      }

      resetForm();
    } catch (error) {
      console.error('Failed to submit task:', error);
      // Show error to user if needed
    }
  };
  
  const resetForm = () => {
    setFormData({ title: '', description: '', status: 'todo', priority: 'medium', assignee: '' });
    setErrors({});
    setShowModal(false);
    setEditingTask(null);
  };
  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData(task);
    setShowModal(true);
  };
  
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await deleteTask(id, token);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleLoadAssignees = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const users = await getAllUsers(token);
      console.log('Fetched users:', users);
      const assignees: Assignee[] = users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
      }))
      console.log('Mapped assignees:', assignees);
      setAvailableAssignees(assignees);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleFilterAssigneeChange = async (assigneeId: string) => {
    setFilterAssignee(assigneeId);
    
    if (assigneeId === 'all') {
      // Reset to all tasks
      const token = localStorage.getItem('authToken');
      if (!token) return;
      try {
        const apiTasks = await getAllTasks(token);
        const transformedTasks = apiTasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignee: task.name,
          assigneeId: task.assigneeId,
        }));
        setTasks(transformedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    } else {
      // Filter by selected user
      const token = localStorage.getItem('authToken');
      if (!token) return;
      try {
        const userId = parseInt(assigneeId);
        const apiTasks = await getTasksByUser(userId, token);
        const transformedTasks = apiTasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignee: task.name,
          assigneeId: task.assigneeId,
        }));
        setTasks(transformedTasks);
      } catch (error) {
        console.error('Failed to fetch user tasks:', error);
      }
    }
  };
  
  const moveTask = async (taskId: number, direction: 'left' | 'right') => {
    const statusOrder = ['todo', 'in-progress', 'done'];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const currentIndex = statusOrder.indexOf(task.status);
    const newIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < statusOrder.length) {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        // TODO: Add API call to update task status
        // const updatedTask = await updateTask(taskId, { status: statusOrder[newIndex] }, token);
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, status: statusOrder[newIndex] } : t
        ));
      } catch (error) {
        console.error('Failed to move task:', error);
      }
    }
  };
  
  const filteredTasks = tasks.filter(task => {
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    const assigneeMatch = filterAssignee === 'all' || task.assignee === filterAssignee;
    return priorityMatch && assigneeMatch;
  });
  
  const getAssigneeName = (email: string) => {
    const assignee = availableAssignees.find(a => a.email === email);
    return assignee ? assignee.name : email;
  };
    // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return null;
  }
    // Show auth page if not logged in
  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }
  
  // Main Task Board
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header currentUser={currentUser} onLogout={handleLogout} />
        
        {/* Actions Bar */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={20} />
            New Task
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm border border-slate-200"
          >
            <Filter size={20} />
            Filters
          </button>
        </div>
        
        <FilterPanel
          show={showFilters}
          filterPriority={filterPriority}
          filterAssignee={filterAssignee}
          priorities={priorities}
          availableAssignees={availableAssignees}
          onPriorityChange={setFilterPriority}
          onAssigneeChange={handleFilterAssigneeChange}
          onLoadAssignees={handleLoadAssignees}
        />
        
        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statuses.map(status => (
            <TaskColumn
              key={status.id}
              status={status}
              tasks={filteredTasks.filter(t => t.status === status.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMove={moveTask}
              getAssigneeName={getAssigneeName}
            />
          ))}
        </div>
      </div>
      
      <TaskModal
        show={showModal}
        editingTask={editingTask}
        formData={formData}
        errors={errors}
        statuses={statuses}
        priorities={priorities}
        availableAssignees={availableAssignees}
        onClose={resetForm}
        onSubmit={handleSubmit}
        onChange={setFormData}
      />
    </div>
  );
}
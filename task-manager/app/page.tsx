'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';

import AuthPage from './components/auth/authPage';
import Header from './components/layout/Header';
import FilterPanel from './components/tasks/fllterPanel';
import TaskColumn from './components/tasks/taskColumn';
import TaskModal from './components/tasks/taskModal';

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
}

interface Assignee {
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
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
  // Only runs once on initial render
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      return JSON.parse(user);
    }
  }
  return null;
});
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Setup project', description: 'Initialize Next.js project', status: 'done', priority: 'high', assignee: 'john@example.com' },
    { id: 2, title: 'Design UI', description: 'Create mockups', status: 'in-progress', priority: 'medium', assignee: 'sarah@example.com' },
    { id: 3, title: 'API Integration', description: 'Connect backend APIs', status: 'todo', priority: 'high', assignee: 'john@example.com' },
  ]);
  
  // TODO: Replace with API call to fetch users from backend
  const [availableAssignees, setAvailableAssignees] = useState<Assignee[]>([
    { email: 'john@example.com', name: 'John Doe' },
    { email: 'sarah@example.com', name: 'Sarah Smith' },
    { email: 'mike@example.com', name: 'Mike Johnson' },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee: ''
  });
  
  const [errors, setErrors] = useState<Errors>({});
  
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
  
 const handleSubmit = () => {
  if (!validateForm()) return;
  
  // TODO: Add API call to create/update task
  if (editingTask) {
    setTasks(tasks.map(t => t.id === editingTask.id ? { ...formData, id: t.id } : t));
  } else {
    // Generate a unique ID based on current max ID + 1
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
    const newTask = { ...formData, id: maxId + 1 };
    setTasks([...tasks, newTask]);
  }
  
  resetForm();
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
  
  const handleDelete = (id: number) => {
    // TODO: Add API call to delete task
    setTasks(tasks.filter(t => t.id !== id));
  };
  
  const moveTask = (taskId: number, direction: 'left' | 'right') => {
    const statusOrder = ['todo', 'in-progress', 'done'];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const currentIndex = statusOrder.indexOf(task.status);
    const newIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < statusOrder.length) {
      // TODO: Add API call to update task status
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, status: statusOrder[newIndex] } : t
      ));
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
          onAssigneeChange={setFilterAssignee}
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
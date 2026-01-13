'use client';

import React from 'react';
import { X } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
}


interface FormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
}

interface Status {
  id: string;
  label: string;
  color: string;
}

interface Assignee {
  email: string;
  name: string;
}

interface Errors {
  title?: string;
  assignee?: string;
}

interface TaskModalProps {
  show: boolean;
  editingTask: Task | null;
  formData: FormData;
  errors: Errors;
  statuses: Status[];
  priorities: string[];
  availableAssignees: Assignee[];
  onClose: () => void;
  onSubmit: () => void;
  onChange: (data: FormData) => void;
}

export default function TaskModal({ 
  show, 
  editingTask, 
  formData, 
  errors, 
  statuses, 
  priorities, 
  availableAssignees,
  onClose, 
  onSubmit, 
  onChange 
}: TaskModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {editingTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onChange({...formData, title: e.target.value})}
              className={`w-full border ${errors.title ? 'border-red-500' : 'border-slate-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Enter task title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onChange({...formData, description: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => onChange({...formData, status: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => onChange({...formData, priority: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorities.map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Assignee *
            </label>
            <select
              value={formData.assignee}
              onChange={(e) => onChange({...formData, assignee: e.target.value})}
              className={`w-full border ${errors.assignee ? 'border-red-500' : 'border-slate-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Select an assignee</option>
              {availableAssignees.map(assignee => (
                <option key={assignee.email} value={assignee.email}>
                  {assignee.name} ({assignee.email})
                </option>
              ))}
            </select>
            {errors.assignee && <p className="text-red-500 text-xs mt-1">{errors.assignee}</p>}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={onSubmit}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
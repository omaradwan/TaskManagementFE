'use client';

import React from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onMove: (taskId: number, direction: 'left' | 'right') => void;
  getAssigneeName: (email: string) => string;
}

export default function TaskCard({ task, onEdit, onDelete, onMove, getAssigneeName }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-800">{task.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="text-slate-500 hover:text-blue-600 p-1"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-slate-500 hover:text-red-600 p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 mb-3">{task.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
            {getAssigneeName(task.assignee)}
          </span>
        </div>
        
        <div className="flex gap-1">
          {task.status !== 'todo' && (
            <button
              onClick={() => onMove(task.id, 'left')}
              className="text-slate-500 hover:text-blue-600 p-1"
              title="Move left"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {task.status !== 'done' && (
            <button
              onClick={() => onMove(task.id, 'right')}
              className="text-slate-500 hover:text-blue-600 p-1"
              title="Move right"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
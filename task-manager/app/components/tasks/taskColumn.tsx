'use client';

import React from 'react';
import TaskCard from './taskCard';

interface Task {
  id: number;
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

interface TaskColumnProps {
  status: Status;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onMove: (taskId: number, direction: 'left' | 'right') => void;
  getAssigneeName: (email: string) => string;
}

export default function TaskColumn({ status, tasks, onEdit, onDelete, onMove, getAssigneeName }: TaskColumnProps) {
  return (
    <div className="flex flex-col">
      <div className={`${status.color} border-2 rounded-t-lg p-4`}>
        <h2 className="font-semibold text-lg text-slate-800">
          {status.label}
          <span className="ml-2 text-sm text-slate-600">
            ({tasks.length})
          </span>
        </h2>
      </div>
      
      <div className="bg-white border-2 border-t-0 border-slate-200 rounded-b-lg p-4 min-h-[500px] space-y-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
            getAssigneeName={getAssigneeName}
          />
        ))}
      </div>
    </div>
  );
}
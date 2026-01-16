'use client';

import React, { useState } from 'react';

interface Assignee {
  email: string;
  name: string;
  id: number;
}

interface FilterPanelProps {
  show: boolean;
  filterPriority: string;
  filterAssignee: string;
  priorities: string[];
  availableAssignees: Assignee[];
  onPriorityChange: (priority: string) => void;
  onAssigneeChange: (assignee: string) => void;
  onLoadAssignees: () => void;
}

export default function FilterPanel({ 
  show, 
  filterPriority, 
  filterAssignee, 
  priorities, 
  availableAssignees, 
  onPriorityChange, 
  onAssigneeChange,
  onLoadAssignees
}: FilterPanelProps) {
  const [isLoadingAssignees, setIsLoadingAssignees] = useState(false);

  const handleAssigneeDropdownOpen = async () => {
    if (availableAssignees.length === 0) {
      setIsLoadingAssignees(true);
      await onLoadAssignees();
      setIsLoadingAssignees(false);
    }
  };

  if (!show) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-slate-200">
      <div className="flex gap-6 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
          <select
            value={filterPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            {priorities.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>
        
        {/* <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Assignee</label>
          <select
            value={filterAssignee}
            onChange={(e) => onAssigneeChange(e.target.value)}
            onFocus={handleAssigneeDropdownOpen}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoadingAssignees}
          >
            <option value="all">
              {isLoadingAssignees ? 'Loading users...' : 'All Assignees'}
            </option>
            {availableAssignees.map(a => (
              <option key={a.id} value={a.id.toString()}>{a.name}</option>
            ))}
          </select>
        </div> */}
      </div>
    </div>
  );
}
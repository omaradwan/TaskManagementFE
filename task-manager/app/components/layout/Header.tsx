'use client';

import React from 'react';
import { LogOut, User } from 'lucide-react';

interface User {
  email: string;
  name: string;
}

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

export default function Header({ currentUser, onLogout }: HeaderProps) {
  return (
    <div className="mb-8 flex justify-between items-start">
      <div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Task Board</h1>
        <p className="text-slate-600">Shared team workspace</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
          <User size={18} className="text-slate-600" />
          <div>
            <p className="text-sm font-medium text-slate-800">{currentUser.name}</p>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm border border-slate-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
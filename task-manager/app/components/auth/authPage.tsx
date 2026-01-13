'use client';

import React, { useState } from 'react';

interface AuthPageProps {
  onAuthSuccess: (user: { email: string; name: string }) => void;
}

interface AuthForm {
  email: string;
  password: string;
  name: string;
}

interface AuthErrors {
  email?: string;
  password?: string;
  name?: string;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [authForm, setAuthForm] = useState<AuthForm>({ email: '', password: '', name: '' });
  const [authErrors, setAuthErrors] = useState<AuthErrors>({});

  const validateAuthForm = () => {
    const newErrors: AuthErrors = {};
    
    if (!authForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(authForm.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!authForm.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (authForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (authView === 'signup' && !authForm.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setAuthErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateAuthForm()) return;
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: authForm.email, password: authForm.password })
    // });
    // const data = await response.json();
    
    const mockUser = { email: authForm.email, name: authForm.email.split('@')[0] };
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    onAuthSuccess(mockUser);
  };

  const handleSignup = async () => {
    if (!validateAuthForm()) return;
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/auth/signup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     email: authForm.email, 
    //     password: authForm.password,
    //     name: authForm.name 
    //   })
    // });
    
    const mockUser = { email: authForm.email, name: authForm.name };
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    onAuthSuccess(mockUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Task Manager</h1>
          <p className="text-slate-600">Collaborate with your team</p>
        </div>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAuthView('login')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              authView === 'login' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthView('signup')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              authView === 'signup' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sign Up
          </button>
        </div>
        
        <div className="space-y-4">
          {authView === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input
                type="text"
                value={authForm.name}
                onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                className={`w-full border ${authErrors.name ? 'border-red-500' : 'border-slate-300'} rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="John Doe"
              />
              {authErrors.name && <p className="text-red-500 text-xs mt-1">{authErrors.name}</p>}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
              className={`w-full border ${authErrors.email ? 'border-red-500' : 'border-slate-300'} rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="you@example.com"
            />
            {authErrors.email && <p className="text-red-500 text-xs mt-1">{authErrors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
              className={`w-full border ${authErrors.password ? 'border-red-500' : 'border-slate-300'} rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="••••••••"
            />
            {authErrors.password && <p className="text-red-500 text-xs mt-1">{authErrors.password}</p>}
          </div>
          
          <button
            onClick={authView === 'login' ? handleLogin : handleSignup}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium mt-6"
          >
            {authView === 'login' ? 'Login' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
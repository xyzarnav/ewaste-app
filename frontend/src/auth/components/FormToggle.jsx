import React from 'react';

export default function FormToggle({ role, onRoleChange }) {
  return (
    <div className="flex justify-center gap-4 mb-4">
      <button
        type="button"
        className={`px-4 py-2 rounded ${role === 'client' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        onClick={() => onRoleChange('client')}
      >
        Client
      </button>
      <button
        type="button"
        className={`px-4 py-2 rounded ${role === 'admin' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        onClick={() => onRoleChange('admin')}
      >
        Admin
      </button>
    </div>
  );
}

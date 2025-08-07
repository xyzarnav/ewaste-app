import React from 'react';

export default function AuthInputField({ name, label, type = 'text', value, onChange, ...props }) {
  return (
    <div className="mb-2">
      <label className="block text-gray-700 mb-1" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        {...props}
      />
    </div>
  );
}

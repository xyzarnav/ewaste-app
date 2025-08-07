import React from 'react';
import AuthInputField from './AuthInputField';
import OAuthButton from './OAuthButton';
import FormToggle from './FormToggle';

export default function AuthForm({
  type,
  role,
  onRoleChange,
  fields,
  onChange,
  onSubmit,
  loading,
  error,
  children,
  showOAuth = false,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded shadow">
      <FormToggle role={role} onRoleChange={onRoleChange} />
      {fields.map((field) => (
        <AuthInputField key={field.name} {...field} onChange={onChange} />
      ))}
      {children}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" disabled={loading}>
        {loading ? 'Loading...' : type}
      </button>
      {showOAuth && (
        <div className="flex flex-col gap-2 mt-4">
          <OAuthButton provider="google" role={role} />
          <OAuthButton provider="apple" role={role} />
        </div>
      )}
    </form>
  );
}

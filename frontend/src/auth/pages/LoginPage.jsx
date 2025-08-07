import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { handleLogin } from '../services/authService';

export default function LoginPage() {
  const [role, setRole] = useState('client');
  const [fields, setFields] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await handleLogin(role, fields);
    setLoading(false);
    if (res.success) {
      navigate(role === 'client' ? '/client-dashboard' : '/admin-dashboard');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <AuthForm
        type="Login"
        role={role}
        onRoleChange={setRole}
        fields={[
          { name: 'username', label: 'Username', value: fields.username, onChange, type: 'text' },
          { name: 'password', label: 'Password', value: fields.password, onChange, type: 'password' },
        ]}
        onChange={onChange}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        showOAuth
      >
        <div className="flex justify-between text-sm mt-2 mb-2">
          <Link to="/forgot-password" className="text-green-600 hover:underline">Forgot Password?</Link>
          <Link to="/register" className="text-green-600 hover:underline">Register</Link>
        </div>
      </AuthForm>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { handleRegister } from '../services/authService';

export default function RegisterPage() {
  const [role, setRole] = useState('client');
  const [fields, setFields] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (fields.password !== fields.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const res = await handleRegister(role, fields);
    setLoading(false);
    if (res.success) {
      setMessage(res.message);
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <AuthForm
        type="Register"
        role={role}
        onRoleChange={setRole}
        fields={[
          { name: 'email', label: 'Email', value: fields.email, onChange, type: 'email' },
          { name: 'username', label: 'Username', value: fields.username, onChange, type: 'text' },
          { name: 'password', label: 'Password', value: fields.password, onChange, type: 'password' },
          { name: 'confirmPassword', label: 'Confirm Password', value: fields.confirmPassword, onChange, type: 'password' },
        ]}
        onChange={onChange}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      >
        <div className="flex justify-between text-sm mt-2 mb-2">
          <Link to="/login" className="text-green-600 hover:underline">Back to Login</Link>
        </div>
        {message && <div className="text-green-600 text-sm mt-2">{message}</div>}
      </AuthForm>
    </div>
  );
}

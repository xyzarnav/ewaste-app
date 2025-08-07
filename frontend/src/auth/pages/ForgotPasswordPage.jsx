import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { handleForgotPassword } from '../services/authService';
import AuthInputField from '../components/AuthInputField';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const res = await handleForgotPassword(email);
    setLoading(false);
    if (res.success) {
      setMessage(res.message);
    } else {
      setError(res.message || 'Error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
      <form onSubmit={onSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded shadow">
        <AuthInputField
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={onChange}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" disabled={loading}>
          {loading ? 'Loading...' : 'Send Reset Email'}
        </button>
        <div className="flex justify-between text-sm mt-2 mb-2">
          <Link to="/login" className="text-green-600 hover:underline">Back to Login</Link>
        </div>
      </form>
    </div>
  );
}

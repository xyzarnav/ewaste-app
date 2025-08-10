import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { handleLogin } from '../services/authService';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState('partner');
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
    
    try {
      const res = await handleLogin(role, fields);
      setLoading(false);
      
      if (res.success) {
        // Redirect based on user role
        if (res.role === 'partner') {
          navigate('/partner/dashboard');
        } else if (res.role === 'admin' || res.role === 'super_admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/'); // Fallback to home
        }
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-80 max-w-sm">
        <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          
          <AuthForm
            type="Login"
            role={role}
            onRoleChange={setRole}
            fields={[
              { name: 'username', label: 'Email', value: fields.username, onChange, type: 'email' },
              { name: 'password', label: 'Password', value: fields.password, onChange, type: 'password' },
            ]}
            onChange={onChange}
            onSubmit={onSubmit}
            loading={loading}
            error={error}
            showOAuth={false}
          >
            <div className="flex justify-between text-sm mt-8">
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Forgot Password?
              </Link>
              <Link to="/register" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Create Account
              </Link>
            </div>
          </AuthForm>
        </div>
      </div>
    </div>
  );
}

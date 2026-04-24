import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Lock } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

import { useAuth } from '../../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Email might already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-600/10 blur-[100px] rounded-full -z-10" />
      
      <div className="w-full max-w-md my-12">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Shield className="w-10 h-10 text-primary-500" />
            <span className="text-2xl font-bold text-white tracking-tight">CodeGuardian</span>
          </Link>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 mt-2">Join the intelligent code review platform</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">Register as</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'STUDENT'})}
                    className={`py-2 rounded-lg border transition-all ${
                      formData.role === 'STUDENT' 
                        ? 'border-primary-500 bg-primary-500/10 text-white' 
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'ADMIN'})}
                    className={`py-2 rounded-lg border transition-all ${
                      formData.role === 'ADMIN' 
                        ? 'border-primary-500 bg-primary-500/10 text-white' 
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    Instructor
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 text-xs mt-2 bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>}
            {success && <div className="text-emerald-500 text-xs mt-2 bg-emerald-500/10 p-2 rounded border border-emerald-500/20 text-center font-bold">Account created! Redirecting to login...</div>}

            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium">Log in</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;

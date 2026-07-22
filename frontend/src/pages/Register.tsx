import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../lib/api';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.register(name, email, password);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'rgb(10 12 20)' }}>
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'rgb(99 102 241)' }} />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: 'rgb(6 182 212)' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgb(99 102 241), rgb(139 92 246))' }}>
            <Sparkles size={28} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="mt-2" style={{ color: 'rgb(148 163 184)' }}>Start crafting content with AI</p>
        </div>

        <div className="rounded-2xl p-8 border" style={{ background: 'rgb(22 27 45)', borderColor: 'rgb(30 41 59)' }}>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg mb-6 text-sm" style={{ background: 'rgb(239 68 68 / 0.1)', color: 'rgb(239 68 68)', border: '1px solid rgb(239 68 68 / 0.2)' }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(148 163 184)' }}>Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(100 116 139)' }} />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                  style={{ background: 'rgb(15 17 26)', border: '1px solid rgb(30 41 59)', color: 'rgb(226 232 240)' }}
                  onFocus={e => (e.target.style.borderColor = 'rgb(99 102 241)')}
                  onBlur={e => (e.target.style.borderColor = 'rgb(30 41 59)')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(148 163 184)' }}>Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(100 116 139)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                  style={{ background: 'rgb(15 17 26)', border: '1px solid rgb(30 41 59)', color: 'rgb(226 232 240)' }}
                  onFocus={e => (e.target.style.borderColor = 'rgb(99 102 241)')}
                  onBlur={e => (e.target.style.borderColor = 'rgb(30 41 59)')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(148 163 184)' }}>Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(100 116 139)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl outline-none transition-all"
                  style={{ background: 'rgb(15 17 26)', border: '1px solid rgb(30 41 59)', color: 'rgb(226 232 240)' }}
                  onFocus={e => (e.target.style.borderColor = 'rgb(99 102 241)')}
                  onBlur={e => (e.target.style.borderColor = 'rgb(30 41 59)')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(100 116 139)' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, rgb(99 102 241), rgb(139 92 246))' }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: 'rgb(100 116 139)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: 'rgb(99 102 241)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

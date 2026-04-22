import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function AuthPage() {
  const [mode, setMode]       = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({
    name: '', email: '', password: '', phone: '', address: ''
  });
  const { login } = useAuth();
  const navigate   = useNavigate();

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = mode === 'login'
        ? await api.login({ email: form.email, password: form.password })
        : await api.register(form);

      const { token, email, name, role } = res.data;
      login({ email, name, role }, token);
      toast.success(`Welcome, ${name}!`);
      navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Hero Panel */}
      <div className="auth-hero">
        <div>
          <div style={{ fontSize: 42, marginBottom: 16 }}>🚗</div>
          <h1>RTO Management<br />System</h1>
          <p>Streamlined regional transport services — vehicle registration, license applications, and real-time status tracking.</p>
        </div>
        <div className="auth-hero-features">
          {[
            'Vehicle Registration & Tracking',
            'Driving License Applications',
            'Real-time Status Updates',
            'Secure JWT Authentication',
          ].map(f => (
            <div className="auth-hero-feature" key={f}>
              <div className="check">✓</div>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <p className="subtitle">
            {mode === 'login'
              ? 'Sign in to your RTO portal account'
              : 'Register to access RTO services'}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input name="name" className="form-input"
                    placeholder="Katakam Srikar" value={form.name}
                    onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input name="phone" className="form-input"
                    placeholder="+91 XXXXX XXXXX" value={form.phone}
                    onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input name="address" className="form-input"
                    placeholder="Visakhapatnam, AP" value={form.address}
                    onChange={handleChange} />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-input"
                placeholder="you@example.com" value={form.email}
                onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-input"
                placeholder="••••••••" value={form.password}
                onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              disabled={loading}>
              {loading ? <span className="spinner" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="auth-toggle">
            {mode === 'login' ? (
              <>Don't have an account? <a onClick={() => setMode('register')}>Register</a></>
            ) : (
              <>Already have an account? <a onClick={() => setMode('login')}>Sign In</a></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

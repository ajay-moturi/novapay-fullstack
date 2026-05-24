import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [step, setStep] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      document.getElementById(`otp-${i-1}`)?.focus();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.login(form);
      toast.success('OTP sent to your email!');
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const otpStr = otp.join('');
      const res = await authAPI.verifyOtp({ email: form.email, otp: otpStr });
      login({ name: res.data.name, email: res.data.email }, res.data.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .glow-btn { transition: all 0.3s ease; }
        .glow-btn:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(99,102,241,0.5); }
        .input-field:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }
        .otp-box:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 20px rgba(99,102,241,0.4); transform: scale(1.05); }
        .float-orb { position: absolute; border-radius: 50%; filter: blur(80px); animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }
        .card-shine { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); }
      `}</style>

      {/* Floating orbs */}
      <div className="float-orb" style={{ width:400,height:400,background:'rgba(99,102,241,0.3)',top:'-100px',right:'-100px',animationDelay:'0s' }}></div>
      <div className="float-orb" style={{ width:300,height:300,background:'rgba(167,139,250,0.2)',bottom:'-50px',left:'-50px',animationDelay:'2s' }}></div>
      <div className="float-orb" style={{ width:200,height:200,background:'rgba(236,72,153,0.2)',top:'50%',left:'10%',animationDelay:'4s' }}></div>

      <div className="card-shine" style={{ borderRadius: 24, padding: '48px 44px', width: 420, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 28, fontWeight: 800,
            color: '#fff', fontFamily: 'Syne, sans-serif',
            boxShadow: '0 10px 30px rgba(99,102,241,0.4)'
          }}>N</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>NovaPay</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Next-gen secure banking</div>
        </div>

        {step === 'login' ? (
          <form onSubmit={handleLogin}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>Welcome back 👋</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>Sign in to your account</div>

            {['email', 'password'].map((field) => (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {field === 'email' ? 'Email Address' : 'Password'}
                </label>
                <input
                  className="input-field"
                  type={field === 'password' ? 'password' : 'email'}
                  value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  placeholder={field === 'email' ? 'you@email.com' : '••••••••'}
                  required
                  style={{
                    width: '100%', padding: '14px 16px', fontSize: 14,
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, color: '#fff', boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
            ))}

            <button className="glow-btn" type="submit" disabled={loading} style={{
              width: '100%', padding: '15px', fontSize: 15, fontWeight: 600,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer',
              marginTop: 8, fontFamily: 'DM Sans, sans-serif'
            }}>
              {loading ? 'Sending OTP...' : 'Continue →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 14, marginTop: 20, color: 'rgba(255,255,255,0.5)' }}>
              No account? <Link to="/register" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>Check your email 📬</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>Enter the 6-digit OTP sent to <span style={{ color: '#a78bfa' }}>{form.email}</span></div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
              {otp.map((digit, i) => (
                <input key={i} id={`otp-${i}`} className="otp-box"
                  type="text" maxLength={1} value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                  style={{
                    width: 52, height: 58, textAlign: 'center', fontSize: 22, fontWeight: 700,
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 12, color: '#fff', transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>

            <button className="glow-btn" type="submit" disabled={loading} style={{
              width: '100%', padding: '15px', fontSize: 15, fontWeight: 600,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              {loading ? 'Verifying...' : 'Verify & Login →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 14, marginTop: 16, cursor: 'pointer', color: '#a78bfa' }}
               onClick={() => { setStep('login'); setOtp(['','','','','','']); }}>
              ← Back to login
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
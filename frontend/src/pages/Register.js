import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(form);
      toast.success('Registered! Check your email for OTP.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
        .float-orb2 { position: absolute; border-radius: 50%; filter: blur(80px); animation: float2 6s ease-in-out infinite; }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }
      `}</style>
      <div style={{ position:'absolute',width:400,height:400,background:'rgba(168,85,247,0.25)',top:'-100px',left:'-100px',borderRadius:'50%',filter:'blur(80px)' }}></div>
      <div style={{ position:'absolute',width:300,height:300,background:'rgba(99,102,241,0.2)',bottom:'-50px',right:'-50px',borderRadius:'50%',filter:'blur(80px)' }}></div>

      <div style={{ background:'rgba(255,255,255,0.05)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24, padding:'48px 44px', width:420, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:64,height:64,borderRadius:18,background:'linear-gradient(135deg, #6366f1, #a855f7)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:28,fontWeight:800,color:'#fff',fontFamily:'Syne, sans-serif',boxShadow:'0 10px 30px rgba(99,102,241,0.4)' }}>N</div>
          <div style={{ fontFamily:'Syne, sans-serif',fontSize:22,fontWeight:800,color:'#fff' }}>NovaPay</div>
          <div style={{ fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4 }}>Create your account</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ fontSize:22,fontWeight:700,color:'#fff',fontFamily:'Syne, sans-serif',marginBottom:6 }}>Get started 🎉</div>
          <div style={{ fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:24 }}>Join thousands of smart bankers</div>

          {[
            { field:'name', label:'Full Name', placeholder:'Arjun Kumar', type:'text' },
            { field:'email', label:'Email Address', placeholder:'you@email.com', type:'email' },
            { field:'password', label:'Password', placeholder:'Min 6 characters', type:'password' },
          ].map(({ field, label, placeholder, type }) => (
            <div key={field} style={{ marginBottom:16 }}>
              <label style={{ display:'block',fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.6)',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em' }}>{label}</label>
              <input className="input-field" type={type} placeholder={placeholder} required value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ width:'100%',padding:'14px 16px',fontSize:14,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#fff',boxSizing:'border-box',transition:'all 0.3s ease' }} />
            </div>
          ))}

          <button className="glow-btn" type="submit" disabled={loading} style={{
            width:'100%',padding:'15px',fontSize:15,fontWeight:600,
            background:'linear-gradient(135deg, #6366f1, #a855f7)',
            color:'#fff',border:'none',borderRadius:12,cursor:'pointer',
            marginTop:8,fontFamily:'DM Sans, sans-serif'
          }}>{loading ? 'Creating account...' : 'Create Account →'}</button>

          <p style={{ textAlign:'center',fontSize:14,marginTop:20,color:'rgba(255,255,255,0.5)' }}>
            Already have an account? <Link to="/login" style={{ color:'#a78bfa',fontWeight:600,textDecoration:'none' }}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
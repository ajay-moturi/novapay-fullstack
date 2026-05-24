import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard',    emoji: '⚡', label: 'Dashboard'    },
  { path: '/transfer',     emoji: '🚀', label: 'Transfer'     },
  { path: '/transactions', emoji: '📋', label: 'Transactions' },
  { path: '/analytics',    emoji: '📊', label: 'Analytics'    },
  { path: '/fraud-alerts', emoji: '🛡️', label: 'Fraud Alerts' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .nav-link { transition: all 0.2s ease; }
        .nav-link:hover { background: rgba(99,102,241,0.15) !important; color: #a78bfa !important; transform: translateX(4px); }
        .nav-active { background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.15)) !important; color: #a78bfa !important; border-left: 3px solid #6366f1 !important; }
        .logout-btn:hover { background: rgba(239,68,68,0.2) !important; color: #f87171 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #2d2d3d; border-radius: 4px; }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'linear-gradient(180deg, #13131f 0%, #0d0d1a 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', padding: '28px 0',
        position: 'fixed', height: '100vh', zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)'
            }}>N</div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, color: '#fff' }}>NovaPay</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Secure Banking</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 12px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>Menu</div>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', marginBottom: 4, borderRadius: 10,
                textDecoration: 'none', fontSize: 14, fontWeight: 500,
                color: isActive ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1))' : 'transparent',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
              })}>
              <span style={{ fontSize: 16 }}>{item.emoji}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 0 0 0' }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: 12,
            padding: '12px 14px', marginBottom: 10,
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0
              }}>{user?.name?.charAt(0)?.toUpperCase()}</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              </div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} style={{
            width: '100%', padding: '10px', fontSize: 13, fontWeight: 500,
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10,
            background: 'rgba(239,68,68,0.08)', color: '#f87171', cursor: 'pointer',
            transition: 'all 0.2s ease', fontFamily: 'DM Sans, sans-serif'
          }}>Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 240, padding: 32, minHeight: '100vh', background: '#0a0a0f' }}>
        {children}
      </main>
    </div>
  );
}
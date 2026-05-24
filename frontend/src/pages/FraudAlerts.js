import React, { useEffect, useState } from 'react';
import { fraudAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SEV = {
  HIGH:   { bg:'rgba(239,68,68,0.12)',   color:'#f87171', border:'rgba(239,68,68,0.25)',   dot:'#ef4444' },
  MEDIUM: { bg:'rgba(234,179,8,0.12)',   color:'#fbbf24', border:'rgba(234,179,8,0.25)',   dot:'#f59e0b' },
  LOW:    { bg:'rgba(34,197,94,0.12)',   color:'#4ade80', border:'rgba(34,197,94,0.25)',   dot:'#22c55e' },
};

export default function FraudAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);

  useEffect(() => {
    fraudAPI.getAlerts()
      .then(res => setAlerts(res.data))
      .catch(() => toast.error('Failed to load alerts'))
      .finally(() => setLoading(false));
  }, []);

  const handleResolve = async (id) => {
    setResolving(id);
    try {
      await fraudAPI.resolve(id);
      setAlerts(prev => prev.map(a => a.id===id ? { ...a, resolved:true } : a));
      toast.success('Alert resolved ✅');
    } catch { toast.error('Failed to resolve'); }
    finally { setResolving(null); }
  };

  const active = alerts.filter(a => !a.resolved);
  const resolved = alerts.filter(a => a.resolved);

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>

      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:28,fontWeight:800,color:'#fff',margin:0,fontFamily:'Syne, sans-serif',letterSpacing:'-0.5px' }}>Fraud Alerts 🛡️</h1>
        <p style={{ fontSize:14,color:'rgba(255,255,255,0.4)',marginTop:6,margin:'6px 0 0' }}>Real-time fraud monitoring for your accounts</p>
      </div>

      {/* Live Status */}
      <div style={{ display:'inline-flex',alignItems:'center',gap:10,padding:'10px 18px',background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:12,marginBottom:24 }}>
        <div style={{ width:8,height:8,borderRadius:'50%',background:'#22c55e',animation:'pulse 1.5s infinite',boxShadow:'0 0 8px #22c55e' }}></div>
        <span style={{ fontSize:13,fontWeight:600,color:'#4ade80' }}>Live Fraud Monitoring Active</span>
        {active.length > 0 && <span style={{ fontSize:12,padding:'2px 10px',borderRadius:8,background:'rgba(239,68,68,0.15)',color:'#f87171',fontWeight:600 }}>{active.length} unresolved</span>}
      </div>

      {loading ? (
        <div style={{ textAlign:'center',padding:48,color:'rgba(255,255,255,0.3)' }}>Loading...</div>
      ) : alerts.length === 0 ? (
        <div style={{ background:'rgba(34,197,94,0.05)',border:'1px solid rgba(34,197,94,0.15)',borderRadius:24,padding:64,textAlign:'center' }}>
          <div style={{ fontSize:64,marginBottom:16 }}>✅</div>
          <div style={{ fontFamily:'Syne, sans-serif',fontSize:22,fontWeight:800,color:'#4ade80',marginBottom:8 }}>All Clear!</div>
          <div style={{ fontSize:15,color:'rgba(255,255,255,0.4)' }}>No fraud alerts detected on your accounts</div>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div style={{ marginBottom:28 }}>
              <div style={{ fontFamily:'Syne, sans-serif',fontWeight:700,color:'#f87171',fontSize:16,marginBottom:14 }}>⚠️ Active Alerts ({active.length})</div>
              {active.map(alert => {
                const s = SEV[alert.severity] || SEV.MEDIUM;
                return (
                  <div key={alert.id} style={{ background:s.bg,border:`1px solid ${s.border}`,borderRadius:20,padding:22,marginBottom:14 }}>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                        <div style={{ width:10,height:10,borderRadius:'50%',background:s.dot,flexShrink:0 }}></div>
                        <div style={{ fontWeight:700,color:'#fff',fontSize:15,fontFamily:'Syne, sans-serif' }}>{alert.reason}</div>
                      </div>
                      <span style={{ fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:8,background:s.bg,color:s.color,border:`1px solid ${s.border}`,textTransform:'uppercase',letterSpacing:'0.05em' }}>
                        {alert.severity}
                      </span>
                    </div>
                    <div style={{ fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:14 }}>
                      {new Date(alert.createdAt).toLocaleString('en-IN')}
                    </div>
                    <div style={{ display:'flex',gap:10 }}>
                      <button onClick={() => handleResolve(alert.id)} disabled={resolving===alert.id}
                        style={{ padding:'9px 18px',fontSize:13,fontWeight:600,borderRadius:10,cursor:'pointer',border:'1px solid rgba(34,197,94,0.3)',background:'rgba(34,197,94,0.1)',color:'#4ade80',transition:'all 0.2s',fontFamily:'DM Sans' }}>
                        {resolving===alert.id ? 'Resolving...' : '✓ Resolve'}
                      </button>
                      <button style={{ padding:'9px 18px',fontSize:13,fontWeight:600,borderRadius:10,cursor:'pointer',border:'1px solid rgba(239,68,68,0.3)',background:'rgba(239,68,68,0.1)',color:'#f87171',transition:'all 0.2s',fontFamily:'DM Sans' }}>
                        🔒 Block Account
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {resolved.length > 0 && (
            <div>
              <div style={{ fontFamily:'Syne, sans-serif',fontWeight:700,color:'rgba(255,255,255,0.3)',fontSize:14,marginBottom:12 }}>Resolved ({resolved.length})</div>
              {resolved.map(alert => (
                <div key={alert.id} style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:16,padding:'16px 20px',marginBottom:10,opacity:0.6 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    <div style={{ fontSize:14,color:'rgba(255,255,255,0.5)' }}>{alert.reason}</div>
                    <span style={{ fontSize:11,padding:'3px 10px',borderRadius:8,background:'rgba(34,197,94,0.1)',color:'#4ade80',fontWeight:600 }}>Resolved</span>
                  </div>
                  <div style={{ fontSize:12,color:'rgba(255,255,255,0.25)',marginTop:6 }}>{new Date(alert.createdAt).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
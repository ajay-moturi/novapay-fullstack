import React, { useEffect, useState } from 'react';
import { accountAPI, transactionAPI } from '../services/api';
import toast from 'react-hot-toast';

const QUICK = [500, 1000, 5000, 10000, 25000];
const CATS = ['Food', 'Shopping', 'Bills', 'Travel', 'Rent', 'Medical', 'Other'];

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ fromAccountNumber:'', toAccountNumber:'', amount:'', category:'Other', description:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newAccType, setNewAccType] = useState('SAVINGS');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    accountAPI.getAll().then(res => {
      setAccounts(res.data);
      if (res.data.length > 0) setForm(f => ({ ...f, fromAccountNumber: res.data[0].accountNumber }));
    });
  }, []);

  const selected = accounts.find(a => a.accountNumber === form.fromAccountNumber);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await transactionAPI.transfer({ ...form, amount: parseFloat(form.amount) });
      setSuccess(res.data);
      toast.success('Transfer successful! 🎉');
      accountAPI.getAll().then(r => setAccounts(r.data));
      setForm(f => ({ ...f, toAccountNumber:'', amount:'', description:'' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transfer failed');
    } finally { setLoading(false); }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await accountAPI.create({ type: newAccType });
      setAccounts(p => [...p, res.data]);
      setForm(f => ({ ...f, fromAccountNumber: res.data.accountNumber }));
      toast.success('Account created!');
      setShowModal(false);
    } catch { toast.error('Failed to create account'); }
    finally { setCreating(false); }
  };

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        .inp:focus{outline:none;border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.2);}
        .quick-btn:hover{background:rgba(99,102,241,0.3)!important;border-color:#6366f1!important;}
        .transfer-btn:hover{transform:translateY(-2px);box-shadow:0 20px 40px rgba(99,102,241,0.4);}
      `}</style>

      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:28,fontWeight:800,color:'#fff',margin:0,fontFamily:'Syne, sans-serif',letterSpacing:'-0.5px' }}>Fund Transfer 🚀</h1>
        <p style={{ fontSize:14,color:'rgba(255,255,255,0.4)',marginTop:6,margin:'6px 0 0' }}>Send money instantly and securely</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:24 }}>
        {/* Form */}
        <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:24,padding:32 }}>
          <form onSubmit={handleTransfer}>

            {/* From Account */}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block',fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.08em' }}>From Account</label>
              {accounts.length === 0 ? (
                <div style={{ padding:'16px',background:'rgba(99,102,241,0.08)',borderRadius:12,border:'1px dashed rgba(99,102,241,0.3)',textAlign:'center',fontSize:14,color:'rgba(255,255,255,0.4)' }}>
                  No accounts. <span style={{ color:'#a78bfa',cursor:'pointer',fontWeight:600 }} onClick={() => setShowModal(true)}>Create one →</span>
                </div>
              ) : (
                <select className="inp" value={form.fromAccountNumber} onChange={e => setForm({ ...form, fromAccountNumber:e.target.value })}
                  style={{ width:'100%',padding:'14px 16px',fontSize:14,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#fff',boxSizing:'border-box',transition:'all 0.3s',cursor:'pointer' }}>
                  {accounts.map(a => <option key={a.id} value={a.accountNumber} style={{ background:'#1a1a2e' }}>
                    {a.type} — ••••{a.accountNumber.slice(-4)} | ₹{parseFloat(a.balance).toLocaleString('en-IN')}
                  </option>)}
                </select>
              )}
            </div>

            {/* To Account */}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block',fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.08em' }}>To Account Number</label>
              <input className="inp" type="text" placeholder="Enter 10-digit account number" required value={form.toAccountNumber}
                onChange={e => setForm({ ...form, toAccountNumber:e.target.value })}
                style={{ width:'100%',padding:'14px 16px',fontSize:14,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#fff',boxSizing:'border-box',transition:'all 0.3s',fontFamily:'monospace' }} />
            </div>

            {/* Amount */}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block',fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.08em' }}>Amount</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.4)',fontSize:18,fontWeight:600 }}>₹</span>
                <input className="inp" type="number" min="1" required placeholder="0.00" value={form.amount}
                  onChange={e => setForm({ ...form, amount:e.target.value })}
                  style={{ width:'100%',padding:'14px 16px 14px 36px',fontSize:22,fontWeight:700,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#fff',boxSizing:'border-box',transition:'all 0.3s' }} />
              </div>
              <div style={{ display:'flex',gap:8,marginTop:10,flexWrap:'wrap' }}>
                {QUICK.map(amt => (
                  <button key={amt} type="button" className="quick-btn"
                    style={{ fontSize:12,padding:'5px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.05)',cursor:'pointer',color:'rgba(255,255,255,0.6)',transition:'all 0.2s' }}
                    onClick={() => setForm({ ...form, amount:amt })}>
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Category & Description */}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20 }}>
              <div>
                <label style={{ display:'block',fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.08em' }}>Category</label>
                <select className="inp" value={form.category} onChange={e => setForm({ ...form, category:e.target.value })}
                  style={{ width:'100%',padding:'13px 16px',fontSize:14,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#fff',transition:'all 0.3s',cursor:'pointer' }}>
                  {CATS.map(c => <option key={c} style={{ background:'#1a1a2e' }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block',fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.08em' }}>Remark</label>
                <input className="inp" type="text" placeholder="Optional note" value={form.description}
                  onChange={e => setForm({ ...form, description:e.target.value })}
                  style={{ width:'100%',padding:'13px 16px',fontSize:14,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#fff',boxSizing:'border-box',transition:'all 0.3s' }} />
              </div>
            </div>

            {/* Balance */}
            {selected && (
              <div style={{ display:'flex',justifyContent:'space-between',padding:'12px 16px',background:'rgba(99,102,241,0.08)',borderRadius:12,border:'1px solid rgba(99,102,241,0.2)',marginBottom:20,fontSize:14 }}>
                <span style={{ color:'rgba(255,255,255,0.5)' }}>Available balance</span>
                <span style={{ color:'#a78bfa',fontWeight:700 }}>₹{parseFloat(selected.balance).toLocaleString('en-IN')}</span>
              </div>
            )}

            <button type="submit" disabled={loading || accounts.length === 0} className="transfer-btn"
              style={{ width:'100%',padding:'16px',fontSize:15,fontWeight:700,background:'linear-gradient(135deg, #6366f1, #a855f7)',color:'#fff',border:'none',borderRadius:14,cursor:loading?'not-allowed':'pointer',transition:'all 0.3s',fontFamily:'DM Sans, sans-serif',letterSpacing:'0.02em' }}>
              {loading ? '⏳ Processing...' : '🚀 Transfer Now'}
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
          {success && (
            <div style={{ background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:20,padding:20 }}>
              <div style={{ fontSize:16,fontWeight:700,color:'#4ade80',marginBottom:12,fontFamily:'Syne, sans-serif' }}>✅ Transfer Successful!</div>
              <div style={{ fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.8 }}>
                <div>Amount: <strong style={{ color:'#fff' }}>₹{parseFloat(success.amount).toLocaleString('en-IN')}</strong></div>
                <div>Status: <strong style={{ color:'#4ade80' }}>{success.status}</strong></div>
              </div>
            </div>
          )}

          <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:20,padding:22 }}>
            <div style={{ fontFamily:'Syne, sans-serif',fontWeight:700,color:'#fff',fontSize:15,marginBottom:14 }}>Your Accounts</div>
            {accounts.map(a => (
              <div key={a.id} style={{ padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:13 }}>
                <div style={{ fontWeight:600,color:'#fff' }}>{a.type}</div>
                <div style={{ fontFamily:'monospace',fontSize:11,color:'rgba(255,255,255,0.35)',margin:'2px 0' }}>{a.accountNumber}</div>
                <div style={{ color:'#a78bfa',fontWeight:700 }}>₹{parseFloat(a.balance).toLocaleString('en-IN')}</div>
              </div>
            ))}
            <button onClick={() => setShowModal(true)} style={{ width:'100%',marginTop:14,padding:'11px',fontSize:13,fontWeight:600,border:'1px solid rgba(99,102,241,0.4)',borderRadius:12,background:'rgba(99,102,241,0.1)',color:'#a78bfa',cursor:'pointer',transition:'all 0.2s',fontFamily:'DM Sans, sans-serif' }}>
              + Create New Account
            </button>
          </div>

          <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:20,padding:22 }}>
            <div style={{ fontFamily:'Syne, sans-serif',fontWeight:700,color:'#fff',fontSize:15,marginBottom:12 }}>ℹ️ Transfer Tips</div>
            {['Transfers above ₹50,000 trigger fraud monitoring','Double-check account number before sending','Email confirmation sent after each transfer'].map((tip, i) => (
              <div key={i} style={{ fontSize:12,color:'rgba(255,255,255,0.4)',padding:'7px 0',borderBottom:i<2?'1px solid rgba(255,255,255,0.04)':'none',display:'flex',gap:8 }}>
                <span style={{ color:'#6366f1' }}>→</span>{tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999 }}>
          <div style={{ background:'#13131f',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:32,width:340 }}>
            <h3 style={{ margin:'0 0 20px',fontFamily:'Syne, sans-serif',fontWeight:700,color:'#fff' }}>Create New Account</h3>
            <label style={{ fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.5)',display:'block',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.08em' }}>Account Type</label>
            <select value={newAccType} onChange={e => setNewAccType(e.target.value)}
              style={{ width:'100%',padding:'13px 16px',fontSize:14,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#fff',marginBottom:24 }}>
              <option style={{ background:'#1a1a2e' }}>SAVINGS</option>
              <option style={{ background:'#1a1a2e' }}>CURRENT</option>
            </select>
            <div style={{ display:'flex',gap:10 }}>
              <button onClick={() => setShowModal(false)} style={{ flex:1,padding:'12px',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,background:'transparent',color:'rgba(255,255,255,0.5)',cursor:'pointer',fontFamily:'DM Sans' }}>Cancel</button>
              <button onClick={handleCreate} disabled={creating} style={{ flex:1,padding:'12px',border:'none',borderRadius:12,background:'linear-gradient(135deg,#6366f1,#a855f7)',color:'#fff',cursor:'pointer',fontWeight:600,fontFamily:'DM Sans' }}>
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountAPI, transactionAPI, fraudAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon, gradient, sub }) => (
  <div style={{
    background: gradient, borderRadius: 20, padding: '24px 24px 20px',
    position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)'
  }}>
    <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.08 }}>{icon}</div>
    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif', letterSpacing: '-1px' }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ color: '#a78bfa', fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#fff', fontWeight: 600 }}>₹{payload[0].value?.toLocaleString('en-IN')}</div>
    </div>
  );
  return null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [spending, setSpending] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      accountAPI.getAll(),
      transactionAPI.getHistory(0, 5),
      transactionAPI.getSpending(),
      fraudAPI.getAlerts(),
    ]).then(([acc, tx, spend, fraud]) => {
      setAccounts(acc.data);
      setTransactions(tx.data.content || []);
      setSpending(spend.data);
      setAlerts(fraud.data.filter(a => !a.resolved).slice(0, 3));
    }).catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + parseFloat(a.balance || 0), 0);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');`}</style>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Loading dashboard...</div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' }}>
            Good morning, {user?.name?.split(' ')[0]} ✨
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 6, margin: '6px 0 0' }}>Here's your financial snapshot today</p>
        </div>
        <div style={{
          background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 12, padding: '8px 16px', fontSize: 13, color: '#a78bfa', fontWeight: 500
        }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Balance" value={`₹${totalBalance.toLocaleString('en-IN')}`} icon="💰"
          gradient="linear-gradient(135deg, #1a1a3e 0%, #2d1b69 100%)"
          sub={`${accounts.length} account${accounts.length !== 1 ? 's' : ''}`} />
        <StatCard label="Transactions" value={transactions.length} icon="📈"
          gradient="linear-gradient(135deg, #0d2137 0%, #0a3d2e 100%)"
          sub="Last 5 transactions" />
        <StatCard label="Fraud Alerts" value={alerts.length} icon="🛡️"
          gradient={alerts.length > 0 ? "linear-gradient(135deg, #2d0a0a 0%, #3d1515 100%)" : "linear-gradient(135deg, #0a2d0a 0%, #153d15 100%)"}
          sub={alerts.length > 0 ? "Needs attention" : "All clear"} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Accounts */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 18 }}>My Accounts</div>
          {accounts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏦</div>
              No accounts yet
            </div>
          ) : accounts.map(acc => (
            <div key={acc.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px', borderRadius: 14, marginBottom: 10,
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💳</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{acc.type}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>••••{acc.accountNumber?.slice(-4)}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>₹{parseFloat(acc.balance).toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, display: 'inline-block', marginTop: 3,
                  background: acc.status === 'ACTIVE' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                  color: acc.status === 'ACTIVE' ? '#4ade80' : '#f87171'
                }}>{acc.status}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 18 }}>Recent Transactions</div>
          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
              No transactions yet
            </div>
          ) : transactions.map((tx, i) => (
            <div key={tx.id || i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: tx.type === 'CREDIT' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
                }}>{tx.type === 'CREDIT' ? '⬆️' : '⬇️'}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{tx.description || tx.category || tx.type}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{new Date(tx.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: tx.type === 'CREDIT' ? '#4ade80' : '#f87171' }}>
                {tx.type === 'CREDIT' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Chart */}
      {spending.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 20 }}>Spending by Category</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={spending} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="category" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Fraud Alerts */}
      {alerts.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: 24 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#f87171', fontSize: 16, marginBottom: 14 }}>🚨 Active Fraud Alerts</div>
          {alerts.map((a, i) => (
            <div key={i} style={{ background: 'rgba(239,68,68,0.1)', borderRadius: 12, padding: '12px 16px', marginBottom: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ fontWeight: 600, color: '#fca5a5', fontSize: 14 }}>{a.reason}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Severity: {a.severity}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
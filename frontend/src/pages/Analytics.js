import React, { useEffect, useState } from 'react';
import { transactionAPI, accountAPI } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1','#a855f7','#ec4899','#f59e0b','#10b981','#3b82f6'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{ background:'#1a1a2e',border:'1px solid rgba(99,102,241,0.3)',borderRadius:12,padding:'12px 16px' }}>
      <div style={{ color:'#a78bfa',fontSize:12,marginBottom:6,fontWeight:600 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color:'#fff',fontWeight:700,fontSize:14 }}>
          <span style={{ color:p.color,marginRight:6 }}>●</span>
          {p.name}: ₹{p.value?.toLocaleString('en-IN')}
        </div>
      ))}
    </div>
  );
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return percent > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export default function Analytics() {
  const [spending, setSpending] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([transactionAPI.getSpending(), accountAPI.getAll()])
      .then(([s, a]) => { setSpending(s.data); setAccounts(a.data); })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const totalSpend = spending.reduce((s, c) => s + parseFloat(c.total || 0), 0);
  const totalBalance = accounts.reduce((s, a) => s + parseFloat(a.balance || 0), 0);

  const monthlyData = MONTHS.slice(0, new Date().getMonth() + 1).map(m => ({
    month: m,
    income: Math.floor(50000 + Math.random() * 20000),
    expense: Math.floor(20000 + Math.random() * 15000),
  }));

  if (loading) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'80vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48,height:48,border:'3px solid rgba(99,102,241,0.3)',borderTopColor:'#6366f1',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px' }}></div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ color:'rgba(255,255,255,0.5)',fontSize:14 }}>Loading analytics...</div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:28,fontWeight:800,color:'#fff',margin:0,fontFamily:'Syne, sans-serif',letterSpacing:'-0.5px' }}>Analytics 📊</h1>
        <p style={{ fontSize:14,color:'rgba(255,255,255,0.4)',marginTop:6,margin:'6px 0 0' }}>Your financial insights and spending patterns</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24 }}>
        {[
          { label:'Total Balance', value:`₹${totalBalance.toLocaleString('en-IN')}`, icon:'💰', grad:'linear-gradient(135deg,#1a1a3e,#2d1b69)' },
          { label:'Monthly Spending', value:`₹${totalSpend.toLocaleString('en-IN')}`, icon:'📉', grad:'linear-gradient(135deg,#2d0a1a,#3d1530)' },
          { label:'Categories', value:spending.length, icon:'🏷️', grad:'linear-gradient(135deg,#0a2d1a,#153d25)' },
        ].map((s,i) => (
          <div key={i} style={{ background:s.grad,borderRadius:20,padding:'24px',border:'1px solid rgba(255,255,255,0.08)',position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',top:-10,right:-10,fontSize:64,opacity:0.1 }}>{s.icon}</div>
            <div style={{ fontSize:12,color:'rgba(255,255,255,0.5)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10 }}>{s.label}</div>
            <div style={{ fontSize:28,fontWeight:800,color:'#fff',fontFamily:'Syne, sans-serif',letterSpacing:'-1px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20 }}>

        {/* Bar Chart - Spending by Category */}
        <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:20,padding:24 }}>
          <div style={{ fontFamily:'Syne, sans-serif',fontWeight:700,color:'#fff',fontSize:16,marginBottom:6 }}>Spending by Category</div>
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:20 }}>Last 30 days breakdown</div>
          {spending.length === 0 ? (
            <div style={{ textAlign:'center',padding:'40px 0',color:'rgba(255,255,255,0.25)' }}>
              <div style={{ fontSize:40,marginBottom:10 }}>📊</div>
              <div>No spending data yet</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={spending} margin={{ top:0,right:0,left:-20,bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="category" tick={{ fill:'rgba(255,255,255,0.4)',fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'rgba(255,255,255,0.4)',fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Amount" radius={[8,8,0,0]}>
                  {spending.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
                <defs>
                  <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:20,padding:24 }}>
          <div style={{ fontFamily:'Syne, sans-serif',fontWeight:700,color:'#fff',fontSize:16,marginBottom:6 }}>Spending Breakdown</div>
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:10 }}>Distribution by category</div>
          {spending.length === 0 ? (
            <div style={{ textAlign:'center',padding:'40px 0',color:'rgba(255,255,255,0.25)' }}>
              <div style={{ fontSize:40,marginBottom:10 }}>🥧</div>
              <div>No data yet</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={spending} dataKey="total" nameKey="category"
                  cx="50%" cy="50%" outerRadius={90} innerRadius={55}
                  paddingAngle={3} labelLine={false} label={renderCustomLabel}>
                  {spending.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => `₹${parseFloat(v).toLocaleString('en-IN')}`} contentStyle={{ background:'#1a1a2e',border:'1px solid rgba(99,102,241,0.3)',borderRadius:12 }} labelStyle={{ color:'#a78bfa' }} itemStyle={{ color:'#fff' }} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color:'rgba(255,255,255,0.6)',fontSize:12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly Trend Area Chart */}
      <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:20,padding:24,marginBottom:20 }}>
        <div style={{ fontFamily:'Syne, sans-serif',fontWeight:700,color:'#fff',fontSize:16,marginBottom:6 }}>Monthly Income vs Expenses</div>
        <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:20 }}>Year-to-date financial trend</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyData} margin={{ top:0,right:10,left:-15,bottom:0 }}>
            <defs>
              <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill:'rgba(255,255,255,0.4)',fontSize:12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'rgba(255,255,255,0.4)',fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color:'rgba(255,255,255,0.5)',fontSize:12 }}>{v}</span>} />
            <Area type="monotone" dataKey="income" name="Income" stroke="#6366f1" strokeWidth={2} fill="url(#incGrad)" dot={false} />
            <Area type="monotone" dataKey="expense" name="Expense" stroke="#ec4899" strokeWidth={2} fill="url(#expGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category Table */}
      {spending.length > 0 && (
        <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:20,padding:24 }}>
          <div style={{ fontFamily:'Syne, sans-serif',fontWeight:700,color:'#fff',fontSize:16,marginBottom:18 }}>Category Breakdown</div>
          <table style={{ width:'100%',borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Category','Amount','Share','Progress'].map(h => (
                  <th key={h} style={{ textAlign:'left',fontSize:11,color:'rgba(255,255,255,0.3)',fontWeight:600,padding:'8px 12px',borderBottom:'1px solid rgba(255,255,255,0.05)',textTransform:'uppercase',letterSpacing:'0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spending.map((s,i) => {
                const pct = totalSpend > 0 ? ((parseFloat(s.total)/totalSpend)*100).toFixed(1) : 0;
                return (
                  <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding:'14px 12px' }}>
                      <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                        <div style={{ width:10,height:10,borderRadius:'50%',background:COLORS[i%COLORS.length],flexShrink:0 }}></div>
                        <span style={{ fontSize:14,fontWeight:500,color:'#fff' }}>{s.category}</span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 12px',fontSize:14,fontWeight:700,color:'#fff' }}>₹{parseFloat(s.total).toLocaleString('en-IN')}</td>
                    <td style={{ padding:'14px 12px',fontSize:13,color:'rgba(255,255,255,0.5)' }}>{pct}%</td>
                    <td style={{ padding:'14px 12px',width:160 }}>
                      <div style={{ background:'rgba(255,255,255,0.06)',borderRadius:6,height:6,overflow:'hidden' }}>
                        <div style={{ width:`${pct}%`,height:'100%',background:COLORS[i%COLORS.length],borderRadius:6,transition:'width 0.5s ease' }}></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
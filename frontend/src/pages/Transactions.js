import React, { useEffect, useState } from 'react';
import { transactionAPI } from '../services/api';
import toast from 'react-hot-toast';

const TYPE_STYLE = {
  CREDIT:   { bg:'rgba(34,197,94,0.12)',  color:'#4ade80',  label:'Credit'   },
  DEBIT:    { bg:'rgba(239,68,68,0.12)',  color:'#f87171',  label:'Debit'    },
  TRANSFER: { bg:'rgba(99,102,241,0.12)', color:'#a78bfa',  label:'Transfer' },
};

const CAT_EMOJI = { Food:'🍕', Shopping:'🛍️', Bills:'⚡', Travel:'✈️', Rent:'🏠', Medical:'💊', Other:'📦' };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    transactionAPI.getHistory(page, 10)
      .then(res => { setTransactions(res.data.content || []); setTotalPages(res.data.totalPages || 1); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = transactions.filter(tx => {
    const matchType = filter === 'ALL' || tx.type === filter;
    const matchSearch = !search || (tx.description||'').toLowerCase().includes(search.toLowerCase()) || (tx.category||'').toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const exportCSV = () => {
    const rows = transactions.map(tx => [tx.id, tx.type, tx.category, tx.description, tx.amount, tx.status, new Date(tx.createdAt).toLocaleString('en-IN')]);
    const csv = [['ID','Type','Category','Description','Amount','Status','Date'], ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
    a.download = 'transactions.csv'; a.click();
    toast.success('CSV exported!');
  };

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        .filter-chip:hover{background:rgba(99,102,241,0.2)!important;color:#a78bfa!important;}
        .tx-row:hover{background:rgba(255,255,255,0.03)!important;}
      `}</style>

      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:28,fontWeight:800,color:'#fff',margin:0,fontFamily:'Syne, sans-serif',letterSpacing:'-0.5px' }}>Transactions 📋</h1>
        <p style={{ fontSize:14,color:'rgba(255,255,255,0.4)',marginTop:6,margin:'6px 0 0' }}>Your complete transaction history</p>
      </div>

      <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:24,padding:28 }}>
        {/* Filters */}
        <div style={{ display:'flex',gap:8,marginBottom:20,flexWrap:'wrap',alignItems:'center' }}>
          {['ALL','CREDIT','DEBIT','TRANSFER'].map(f => (
            <button key={f} className="filter-chip" onClick={() => setFilter(f)} style={{
              padding:'7px 16px',borderRadius:10,fontSize:13,fontWeight:500,cursor:'pointer',transition:'all 0.2s',
              border: filter===f ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
              background: filter===f ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
              color: filter===f ? '#a78bfa' : 'rgba(255,255,255,0.5)',
              fontFamily:'DM Sans, sans-serif'
            }}>{f}</button>
          ))}
          <input type="text" placeholder="🔍 Search transactions..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex:1,minWidth:200,padding:'9px 14px',fontSize:14,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'#fff',outline:'none',transition:'all 0.3s' }} />
          <button onClick={exportCSV} style={{ padding:'9px 16px',fontSize:13,fontWeight:600,border:'1px solid rgba(99,102,241,0.3)',borderRadius:10,background:'rgba(99,102,241,0.08)',color:'#a78bfa',cursor:'pointer',fontFamily:'DM Sans' }}>
            ⬇ Export CSV
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding:48,textAlign:'center',color:'rgba(255,255,255,0.3)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:48,textAlign:'center' }}>
            <div style={{ fontSize:48,marginBottom:12 }}>📭</div>
            <div style={{ color:'rgba(255,255,255,0.3)',fontSize:15 }}>No transactions found</div>
          </div>
        ) : (
          <table style={{ width:'100%',borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Description','Category','Type','Amount','Date','Status'].map(h => (
                  <th key={h} style={{ textAlign:'left',fontSize:11,color:'rgba(255,255,255,0.3)',fontWeight:600,padding:'8px 12px',borderBottom:'1px solid rgba(255,255,255,0.05)',textTransform:'uppercase',letterSpacing:'0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, i) => {
                const ts = TYPE_STYLE[tx.type] || TYPE_STYLE.TRANSFER;
                return (
                  <tr key={tx.id||i} className="tx-row" style={{ borderBottom:'1px solid rgba(255,255,255,0.03)',transition:'all 0.15s',cursor:'default' }}>
                    <td style={{ padding:'14px 12px',fontSize:14,fontWeight:500,color:'#fff' }}>{tx.description || '-'}</td>
                    <td style={{ padding:'14px 12px' }}>
                      <span style={{ fontSize:13,color:'rgba(255,255,255,0.5)' }}>{CAT_EMOJI[tx.category]||'📦'} {tx.category||'Other'}</span>
                    </td>
                    <td style={{ padding:'14px 12px' }}>
                      <span style={{ fontSize:12,fontWeight:600,padding:'4px 10px',borderRadius:8,background:ts.bg,color:ts.color }}>{ts.label}</span>
                    </td>
                    <td style={{ padding:'14px 12px',fontSize:15,fontWeight:700,color:tx.type==='CREDIT'?'#4ade80':'#f87171' }}>
                      {tx.type==='CREDIT'?'+':'-'}₹{parseFloat(tx.amount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding:'14px 12px',fontSize:12,color:'rgba(255,255,255,0.35)' }}>{new Date(tx.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding:'14px 12px' }}>
                      <span style={{ fontSize:11,padding:'3px 9px',borderRadius:8,background:tx.status==='SUCCESS'?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)',color:tx.status==='SUCCESS'?'#4ade80':'#f87171',fontWeight:600 }}>{tx.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div style={{ display:'flex',justifyContent:'center',alignItems:'center',gap:12,marginTop:24 }}>
          <button onClick={() => setPage(p => Math.max(0,p-1))} disabled={page===0}
            style={{ padding:'8px 18px',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,background:'rgba(255,255,255,0.04)',color:page===0?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)',cursor:page===0?'not-allowed':'pointer',fontFamily:'DM Sans',fontSize:13 }}>
            ← Prev
          </button>
          <span style={{ fontSize:13,color:'rgba(255,255,255,0.4)' }}>Page {page+1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1}
            style={{ padding:'8px 18px',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,background:'rgba(255,255,255,0.04)',color:page>=totalPages-1?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)',cursor:page>=totalPages-1?'not-allowed':'pointer',fontFamily:'DM Sans',fontSize:13 }}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
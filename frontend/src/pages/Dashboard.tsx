import { useEffect, useState } from 'react';
import { invoicesService } from '../services/api';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  PAID:    { label: 'Payée',     bg: '#d1fae5', color: '#065f46' },
  UNPAID:  { label: 'En attente', bg: '#fee2e2', color: '#991b1b' },
  PENDING: { label: 'Brouillon', bg: '#fef9c3', color: '#854d0e' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, bg: '#f1f5f9', color: '#475569' };
  return (
    <span style={{
      background: cfg.bg,
      color: cfg.color,
      fontSize: 11,
      fontWeight: 600,
      padding: '3px 10px',
      borderRadius: 999,
      letterSpacing: '0.02em',
    }}>
      {cfg.label}
    </span>
  );
}

function StatCard({
  label, value, sub, accent,
}: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #d1fae5',
      borderRadius: 20,
      padding: '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(230, 219, 219, 0.1)';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#6ee7b7';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#d1fae5';
      }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <p style={{ fontSize: 30, fontWeight: 800, color: accent, letterSpacing: '-1px', lineHeight: 1.1 }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: '#9ca3af' }}>{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await invoicesService.getAll();
      setInvoices(res.data);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout(); navigate('/login');
      } else {
        console.error('Error loading invoices:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const total  = invoices.reduce((s, i) => s + i.total, 0);
  const paid   = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.total, 0);
  const unpaid = invoices.filter(i => i.status === 'UNPAID').reduce((s, i) => s + i.total, 0);
  const paidCount   = invoices.filter(i => i.status === 'PAID').length;
  const unpaidCount = invoices.filter(i => i.status === 'UNPAID').length;

  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' MAD';

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      maxWidth: 1100,
      margin: '0 auto',
      padding: '40px 32px 64px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .du0 { animation: fadeUp 0.5s ease both; }
        .du1 { animation: fadeUp 0.5s 0.07s ease both; }
        .du2 { animation: fadeUp 0.5s 0.14s ease both; }
        .du3 { animation: fadeUp 0.5s 0.21s ease both; }
        .inv-row { transition: background 0.15s; }
        .inv-row:hover { background: #f0fdf4 !important; }
        .btn-voir:hover { color: #059669 !important; }
      `}</style>

      
      <div className="du0" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: '#10b981', textTransform: 'uppercase', marginBottom: 6 }}>
            Vue d'ensemble
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#000000', letterSpacing: '-0.5px', margin: 0 }}>Dashboard</h1>
        </div>
        <button
          onClick={() => navigate('/invoices')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: '#059669',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 4px 14px rgba(16,185,129,0.25)',
            transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#047857';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(16,185,129,0.30)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#059669';
            (e.currentTarget as HTMLButtonElement).style.transform = '';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(16,185,129,0.25)';
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvelle facture
        </button>
      </div>

      {loading ? (
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 80, borderRadius: 20, background: 'linear-gradient(90deg,#f0fdf4 25%,#d1fae5 50%,#f0fdf4 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', opacity: 0.7 }} />
          ))}
          <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        </div>
      ) : (
        <>
          
          <div className="du1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            <StatCard label="Total facturé"  value={fmt(total)}  sub={`${invoices.length} facture${invoices.length > 1 ? 's' : ''}`} accent="#0f172a" />
            <StatCard label="Payé"           value={fmt(paid)}   sub={`${paidCount} facture${paidCount > 1 ? 's' : ''} réglée${paidCount > 1 ? 's' : ''}`} accent="#059669" />
            <StatCard label="En attente"     value={fmt(unpaid)} sub={`${unpaidCount} facture${unpaidCount > 1 ? 's' : ''} impayée${unpaidCount > 1 ? 's' : ''}`} accent="#dc2626" />
          </div>

          
          {total > 0 && (
            <div className="du2" style={{ background: '#fff', border: '1px solid #d1fae5', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Taux de recouvrement</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>{Math.round((paid / total) * 100)}%</p>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: '#fee2e2', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round((paid / total) * 100)}%`,
                  background: '#10b981',
                  borderRadius: 999,
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 11, color: '#10b981', fontWeight: 500 }}>Payé · {fmt(paid)}</span>
                <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 500 }}>En attente · {fmt(unpaid)}</span>
              </div>
            </div>
          )}

          
          <div className="du3" style={{ background: '#fff', border: '1px solid #d1fae5', borderRadius: 20, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #d1fae5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Dernières factures</h3>
                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Les 5 plus récentes</p>
              </div>
              <button
                className="btn-voir"
                onClick={() => navigate('/invoices')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#10b981',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'color 0.2s',
                }}
              >
                Voir tout
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

           
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr',
              padding: '10px 24px',
              borderBottom: '1px solid #f0fdf4',
              background: '#f9fafb',
            }}>
              {['Facture', 'Client', 'Montant', 'Statut'].map(h => (
                <p key={h} style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{h}</p>
              ))}
            </div>

          
            {invoices.slice(0, 5).map((inv, i) => (
              <div
                key={inv.id}
                className="inv-row"
                onClick={() => navigate(`/invoices/${inv.id}`)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1fr 1fr',
                  padding: '14px 24px',
                  borderBottom: i < Math.min(invoices.length, 5) - 1 ? '1px solid #f0fdf4' : 'none',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: '#fff',
                }}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{inv.number}</p>
                </div>
                <div>
                  <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>{inv.client?.name ?? '—'}</p>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{inv.total.toLocaleString('fr-FR')} MAD</p>
                </div>
                <div>
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            ))}

            {invoices.length === 0 && (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f0fdf4', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Aucune facture pour le moment</p>
                <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>Créez votre première facture pour commencer.</p>
                <button
                  onClick={() => navigate('/invoices')}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 9,
                    border: 'none',
                    background: '#059669',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Créer une facture
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
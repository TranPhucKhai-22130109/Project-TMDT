'use client';

import { useEffect, useState } from 'react';

const BACKEND_URL = 'http://localhost:8080';

export default function TestPage() {
  const [data, setData]     = useState(null);
  const [error, setError]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/hello`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.badge}>GET /api/hello</span>
          <h1 style={styles.title}>🔌 Backend Connection Test</h1>
          <p style={styles.subtitle}>
            Kiểm tra kết nối giữa Next.js (FE) và Spring Boot (BE)
          </p>
        </div>

        {/* Divider */}
        <hr style={styles.divider} />

        {/* Result */}
        <div style={styles.resultBox}>
          {loading && (
            <div style={styles.statusRow}>
              <span style={{ ...styles.dot, background: '#f59e0b' }} />
              <span style={styles.statusText}>Đang gọi API…</span>
            </div>
          )}

          {!loading && error && (
            <>
              <div style={styles.statusRow}>
                <span style={{ ...styles.dot, background: '#ef4444' }} />
                <span style={{ ...styles.statusText, color: '#ef4444' }}>
                  Kết nối thất bại
                </span>
              </div>
              <pre style={{ ...styles.code, borderColor: '#ef4444', color: '#ef4444' }}>
                {error}
              </pre>
              <p style={styles.hint}>
                💡 Hãy chắc chắn Spring Boot đang chạy tại{' '}
                <code style={styles.inlineCode}>{BACKEND_URL}</code>
              </p>
            </>
          )}

          {!loading && data && (
            <>
              <div style={styles.statusRow}>
                <span style={{ ...styles.dot, background: '#22c55e' }} />
                <span style={{ ...styles.statusText, color: '#22c55e' }}>
                  Kết nối thành công ✓
                </span>
              </div>
              <pre style={{ ...styles.code, borderColor: '#22c55e' }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </>
          )}
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          Backend URL:{' '}
          <a href={`${BACKEND_URL}/api/hello`} target="_blank" rel="noreferrer"
             style={styles.link}>
            {BACKEND_URL}/api/hello
          </a>
        </p>
      </div>
    </main>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: '2rem',
  },
  card: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '1rem',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '540px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  header: {
    marginBottom: '1.5rem',
  },
  badge: {
    display: 'inline-block',
    background: '#0ea5e9',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    padding: '0.2rem 0.65rem',
    borderRadius: '999px',
    marginBottom: '0.75rem',
  },
  title: {
    color: '#f1f5f9',
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: '0 0 0.4rem',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    margin: 0,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #334155',
    margin: '0 0 1.5rem',
  },
  resultBox: {
    minHeight: '100px',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
  },
  statusText: {
    color: '#e2e8f0',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  code: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '0.5rem',
    padding: '1rem',
    color: '#7dd3fc',
    fontSize: '0.9rem',
    overflowX: 'auto',
    margin: '0 0 1rem',
  },
  hint: {
    color: '#94a3b8',
    fontSize: '0.85rem',
    margin: 0,
  },
  inlineCode: {
    background: '#0f172a',
    padding: '0.1rem 0.35rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    color: '#7dd3fc',
  },
  footer: {
    marginTop: '1.5rem',
    color: '#64748b',
    fontSize: '0.8rem',
    borderTop: '1px solid #334155',
    paddingTop: '1rem',
  },
  link: {
    color: '#38bdf8',
    textDecoration: 'none',
  },
};

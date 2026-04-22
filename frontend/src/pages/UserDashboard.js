import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import Sidebar from '../components/common/Sidebar';

export default function UserDashboard() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([api.getMyVehicles(), api.getMyLicenses()])
      .then(([v, l]) => { setVehicles(v.data); setLicenses(l.data); })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: '🚗', label: 'Registered Vehicles', value: vehicles.length,   color: '#dbeafe', iconBg: '#1a56db' },
    { icon: '📋', label: 'License Applications', value: licenses.length,  color: '#d1fae5', iconBg: '#0e9f6e' },
    { icon: '✅', label: 'Active Vehicles',      value: vehicles.filter(v => v.status === 'ACTIVE').length,   color: '#fef3c7', iconBg: '#f59e0b' },
    { icon: '🎫', label: 'Approved Licenses',    value: licenses.filter(l => l.status === 'APPROVED').length, color: '#ede9fe', iconBg: '#7c3aed' },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>👋 Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p>Here's your RTO service overview</p>
        </div>

        <div className="stats-grid">
          {stats.map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon" style={{ background: s.color }}>
                <span>{s.icon}</span>
              </div>
              <div className="stat-value">{loading ? '—' : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Recent Vehicles */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">My Vehicles</div>
                <div className="card-subtitle">Recent registrations</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/vehicles')}>
                + Register
              </button>
            </div>
            {vehicles.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🚗</div>
                <h3>No vehicles yet</h3>
                <p>Register your first vehicle</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Reg No.</th><th>Type</th><th>Status</th></tr></thead>
                  <tbody>
                    {vehicles.slice(0, 5).map(v => (
                      <tr key={v.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{v.registrationNumber}</td>
                        <td>{v.vehicleType}</td>
                        <td><span className={`badge badge-${v.status?.toLowerCase()}`}>{v.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Licenses */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">My Licenses</div>
                <div className="card-subtitle">Application status</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/licenses')}>
                + Apply
              </button>
            </div>
            {licenses.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📋</div>
                <h3>No applications yet</h3>
                <p>Apply for your driving license</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>License No.</th><th>Type</th><th>Status</th></tr></thead>
                  <tbody>
                    {licenses.slice(0, 5).map(l => (
                      <tr key={l.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          {l.licenseNumber || '—'}
                        </td>
                        <td>{l.licenseType}</td>
                        <td><span className={`badge badge-${l.status?.toLowerCase()}`}>{l.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

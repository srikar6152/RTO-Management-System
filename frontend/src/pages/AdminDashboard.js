import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../components/common/Sidebar';
import * as api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats]     = useState({});
  const [licenses, setLicenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.getDashboardStats(),
      api.getAllLicenses(),
      api.getAllVehicles(),
    ]).then(([s, l, v]) => {
      setStats(s.data);
      setLicenses(l.data);
      setVehicles(v.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleLicenseStatus = async (id, status) => {
    try {
      await api.updateLicenseStatus(id, status);
      setLicenses(ls => ls.map(l => l.id === id ? { ...l, status } : l));
      toast.success(`License ${status.toLowerCase()}`);
    } catch { toast.error('Update failed'); }
  };

  const handleVehicleStatus = async (id, status) => {
    try {
      await api.updateVehicleStatus(id, status);
      setVehicles(vs => vs.map(v => v.id === id ? { ...v, status } : v));
      toast.success(`Vehicle ${status.toLowerCase()}`);
    } catch { toast.error('Update failed'); }
  };

  const statCards = [
    { icon: '👥', label: 'Total Users',       value: stats.totalUsers,       color: '#dbeafe' },
    { icon: '🚗', label: 'Total Vehicles',     value: stats.totalVehicles,    color: '#d1fae5' },
    { icon: '📋', label: 'Total Licenses',     value: stats.totalLicenses,    color: '#fef3c7' },
    { icon: '⏳', label: 'Pending Vehicles',   value: stats.pendingVehicles,  color: '#fee2e2' },
    { icon: '📝', label: 'Pending Licenses',   value: stats.pendingLicenses,  color: '#ede9fe' },
    { icon: '✅', label: 'Active Vehicles',    value: stats.activeVehicles,   color: '#d1fae5' },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>📊 Admin Dashboard</h1>
          <p>Manage all RTO operations</p>
        </div>

        <div className="stats-grid">
          {statCards.map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
              <div className="stat-value">{loading ? '—' : (s.value ?? 0)}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pending Licenses */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div>
              <div className="card-title">License Applications</div>
              <div className="card-subtitle">Approve or reject pending applications</div>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Applicant</th><th>Type</th><th>Applied</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {licenses.slice(0, 10).map(l => (
                  <tr key={l.id}>
                    <td style={{ fontFamily: 'monospace' }}>#{l.id}</td>
                    <td>{l.user?.name || '—'}</td>
                    <td>{l.licenseType}</td>
                    <td>{l.issueDate}</td>
                    <td><span className={`badge badge-${l.status?.toLowerCase()}`}>{l.status}</span></td>
                    <td>
                      {l.status === 'APPLIED' || l.status === 'UNDER_REVIEW' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-success btn-sm"
                            onClick={() => handleLicenseStatus(l.id, 'APPROVED')}>
                            ✓ Approve
                          </button>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => handleLicenseStatus(l.id, 'REJECTED')}>
                            ✕ Reject
                          </button>
                        </div>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Vehicles */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Vehicle Registrations</div>
              <div className="card-subtitle">Activate or suspend vehicle registrations</div>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Reg. No.</th><th>Owner</th><th>Type</th><th>Make/Model</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {vehicles.slice(0, 10).map(v => (
                  <tr key={v.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{v.registrationNumber}</td>
                    <td>{v.user?.name || '—'}</td>
                    <td>{v.vehicleType}</td>
                    <td>{v.makeModel}</td>
                    <td><span className={`badge badge-${v.status?.toLowerCase()}`}>{v.status}</span></td>
                    <td>
                      {v.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-success btn-sm"
                            onClick={() => handleVehicleStatus(v.id, 'ACTIVE')}>
                            ✓ Activate
                          </button>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => handleVehicleStatus(v.id, 'SUSPENDED')}>
                            ✕ Suspend
                          </button>
                        </div>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

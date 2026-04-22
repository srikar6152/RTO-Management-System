import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/common/Sidebar';
import * as api from '../services/api';

const EMPTY_FORM = { licenseType: '', dateOfBirth: '', bloodGroup: '' };

export default function LicensesPage() {
  const [licenses, setLicenses]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchLicenses = () => {
    api.getMyLicenses()
      .then(r => setLicenses(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLicenses(); }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.applyLicense(form);
      toast.success('License application submitted!');
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchLicenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>📋 My Licenses</h1>
          <p>Track your driving license applications</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">License Applications</div>
              <div className="card-subtitle">{licenses.length} application(s)</div>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Apply for License
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>Loading...</p>
          ) : licenses.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📋</div>
              <h3>No applications found</h3>
              <p>Apply for your driving license to get started</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>License No.</th>
                    <th>Type</th>
                    <th>Blood Group</th>
                    <th>Issue Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {licenses.map(l => (
                    <tr key={l.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        {l.licenseNumber || <span style={{ color: 'var(--text-muted)' }}>Pending</span>}
                      </td>
                      <td>{l.licenseType}</td>
                      <td>{l.bloodGroup || '—'}</td>
                      <td>{l.issueDate}</td>
                      <td>{l.expiryDate}</td>
                      <td><span className={`badge badge-${l.status?.toLowerCase()}`}>{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Apply Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Apply for Driving License</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">License Type</label>
                  <select name="licenseType" className="form-select"
                    value={form.licenseType} onChange={handleChange} required>
                    <option value="">Select type</option>
                    <option value="LMV">LMV – Light Motor Vehicle</option>
                    <option value="HMV">HMV – Heavy Motor Vehicle</option>
                    <option value="MOTORCYCLE">Motorcycle</option>
                    <option value="TRANSPORT">Transport Vehicle</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input name="dateOfBirth" type="date" className="form-input"
                    value={form.dateOfBirth} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select name="bloodGroup" className="form-select"
                    value={form.bloodGroup} onChange={handleChange}>
                    <option value="">Select blood group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g =>
                      <option key={g} value={g}>{g}</option>
                    )}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={submitting}>
                  {submitting ? <span className="spinner" /> : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

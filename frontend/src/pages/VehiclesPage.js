import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/common/Sidebar';
import * as api from '../services/api';

const EMPTY_FORM = {
  vehicleType: '', makeModel: '', color: '',
  chassisNumber: '', engineNumber: '', manufactureYear: ''
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchVehicles = () => {
    api.getMyVehicles()
      .then(r => setVehicles(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.registerVehicle({ ...form, manufactureYear: parseInt(form.manufactureYear) });
      toast.success('Vehicle registered successfully!');
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>🚗 My Vehicles</h1>
          <p>Manage your registered vehicles</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Vehicle Registrations</div>
              <div className="card-subtitle">{vehicles.length} vehicle(s) registered</div>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Register Vehicle
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>Loading...</p>
          ) : vehicles.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🚗</div>
              <h3>No vehicles registered</h3>
              <p>Click "Register Vehicle" to get started</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Reg. Number</th>
                    <th>Make / Model</th>
                    <th>Type</th>
                    <th>Color</th>
                    <th>Year</th>
                    <th>Reg. Date</th>
                    <th>Expiry</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(v => (
                    <tr key={v.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{v.registrationNumber}</td>
                      <td>{v.makeModel}</td>
                      <td>{v.vehicleType}</td>
                      <td>{v.color}</td>
                      <td>{v.manufactureYear}</td>
                      <td>{v.registrationDate}</td>
                      <td>{v.expiryDate}</td>
                      <td><span className={`badge badge-${v.status?.toLowerCase()}`}>{v.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Register Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Register New Vehicle</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Vehicle Type</label>
                    <select name="vehicleType" className="form-select"
                      value={form.vehicleType} onChange={handleChange} required>
                      <option value="">Select type</option>
                      <option>TWO_WHEELER</option>
                      <option>FOUR_WHEELER</option>
                      <option>HEAVY_VEHICLE</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Make / Model</label>
                    <input name="makeModel" className="form-input"
                      placeholder="e.g. Honda City" value={form.makeModel}
                      onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Color</label>
                    <input name="color" className="form-input"
                      placeholder="e.g. White" value={form.color}
                      onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Manufacture Year</label>
                    <input name="manufactureYear" type="number" className="form-input"
                      placeholder="2022" min="1900" max={new Date().getFullYear()}
                      value={form.manufactureYear} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Chassis Number</label>
                    <input name="chassisNumber" className="form-input"
                      placeholder="17-char VIN / Chassis No."
                      value={form.chassisNumber} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Engine Number</label>
                    <input name="engineNumber" className="form-input"
                      placeholder="Engine number"
                      value={form.engineNumber} onChange={handleChange} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={submitting}>
                  {submitting ? <span className="spinner" /> : 'Register Vehicle'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

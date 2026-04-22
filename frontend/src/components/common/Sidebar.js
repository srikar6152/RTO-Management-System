import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const USER_LINKS = [
  { to: '/dashboard',          icon: '🏠', label: 'Dashboard'    },
  { to: '/vehicles',           icon: '🚗', label: 'My Vehicles'  },
  { to: '/licenses',           icon: '📋', label: 'My Licenses'  },
];

const ADMIN_LINKS = [
  { to: '/admin',              icon: '📊', label: 'Dashboard'    },
  { to: '/admin/vehicles',     icon: '🚗', label: 'All Vehicles' },
  { to: '/admin/licenses',     icon: '📋', label: 'All Licenses' },
  { to: '/admin/users',        icon: '👥', label: 'Users'        },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const links     = isAdmin() ? ADMIN_LINKS : USER_LINKS;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🚦</div>
        <div>
          <h2>RTO Portal</h2>
          <span>{isAdmin() ? 'Admin Panel' : 'Citizen Portal'}</span>
        </div>
      </div>

      <nav className="nav-section">
        <div className="nav-label">Menu</div>
        {links.map(l => (
          <button
            key={l.to}
            className={`nav-item ${location.pathname === l.to ? 'active' : ''}`}
            onClick={() => navigate(l.to)}
          >
            <span className="icon">{l.icon}</span>
            {l.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="info">
            <div className="name">{user?.name}</div>
            <span className={`badge badge-${user?.role?.toLowerCase()}`}>{user?.role}</span>
          </div>
        </div>
        <button
          className="nav-item"
          style={{ marginTop: 8, color: '#e02424' }}
          onClick={() => { logout(); navigate('/login'); }}
        >
          <span className="icon">🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../api';
import { Users, Calendar, CheckCircle, XCircle, UserPlus, CheckSquare, LayoutList } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardAPI.getStats();
      console.log('Dashboard stats received:', response.data);
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">
          <XCircle size={20} />
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="page-subtitle">
          <Calendar size={16} />
          {formatDate()}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate('/employees')}>
          <div className="stat-content">
            <div className="stat-label">Total Employees</div>
            <div className="stat-value">{stats?.total_employees || 0}</div>
            <div className="stat-subtitle">Click to manage employees</div>
          </div>
          <div className="stat-icon primary">
            <Users size={28} />
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/attendance')}>
          <div className="stat-content">
            <div className="stat-label">Present Today</div>
            <div className="stat-value" style={{ color: 'var(--success-color)' }}>
              {stats?.today_present || 0}
            </div>
            <div className="stat-subtitle">Click to view attendance</div>
          </div>
          <div className="stat-icon success">
            <CheckCircle size={28} />
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/attendance')}>
          <div className="stat-content">
            <div className="stat-label">Absent Today</div>
            <div className="stat-value" style={{ color: 'var(--danger-color)' }}>
              {stats?.today_absent || 0}
            </div>
            <div className="stat-subtitle">Click to view attendance</div>
          </div>
          <div className="stat-icon danger">
            <XCircle size={28} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <LayoutList size={20} />
            Department Breakdown
          </h2>
        </div>
        <div className="department-grid">
          {stats?.departments && Object.keys(stats.departments).length > 0 ? (
            Object.entries(stats.departments).map(([dept, count]) => (
              <div key={dept} className="department-card">
                <div className="department-count">{count}</div>
                <div className="department-name">{dept}</div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>No departments yet</p>
              <p style={{ fontSize: '0.875rem' }}>Add employees to see department breakdown</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <CheckSquare size={20} />
            Quick Actions
          </h2>
        </div>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => navigate('/employees')}>
            <UserPlus size={18} />
            Add Employee
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/attendance')}>
            <CheckSquare size={18} />
            Mark Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

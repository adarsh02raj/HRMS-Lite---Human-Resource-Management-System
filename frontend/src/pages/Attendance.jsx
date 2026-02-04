import React, { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from '../api';
import { Plus, Calendar, CheckCircle, XCircle, User, AlertCircle, Loader, Filter, X } from 'lucide-react';

function MarkAttendanceModal({ isOpen, onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employee_id) newErrors.employee_id = 'Please select an employee';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.status) newErrors.status = 'Status is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await attendanceAPI.create(formData);
      onSuccess();
      onClose();
      setFormData({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
      setErrors({});
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to mark attendance';
      setErrors({ submit: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Mark Attendance</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.submit && (
              <div className="alert alert-error">
                <AlertCircle size={20} />
                <span>{errors.submit}</span>
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label required">Employee</label>
              <select
                name="employee_id"
                className={`form-select ${errors.employee_id ? 'error' : ''}`}
                value={formData.employee_id}
                onChange={handleChange}
              >
                <option value="">Select an employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.employee_id}>
                    {emp.employee_id} - {emp.full_name}
                  </option>
                ))}
              </select>
              {errors.employee_id && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.employee_id}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label required">Date</label>
              <input
                type="date"
                name="date"
                className={`form-input ${errors.date ? 'error' : ''}`}
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.date}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label required">Status</label>
              <select
                name="status"
                className={`form-select ${errors.status ? 'error' : ''}`}
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
              {errors.status && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.status}
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader size={18} className="spinner" />
                  Marking...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Mark Attendance
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filterDate) params.date_filter = filterDate;
      if (filterEmployee) params.employee_id = filterEmployee;
      
      const response = await attendanceAPI.getAll(params);
      setAttendanceRecords(response.data);
    } catch (err) {
      setError('Failed to load attendance records');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchAttendance();
  };

  const clearFilters = () => {
    setFilterDate('');
    setFilterEmployee('');
    setTimeout(fetchAttendance, 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Attendance Management</h1>
        <p className="page-description">Track and manage employee attendance</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Filter Attendance</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Filter by Employee</label>
            <select
              className="form-select"
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.employee_id} - {emp.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Filter by Date</label>
            <input
              type="date"
              className="form-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={handleFilter}>
            <Filter size={18} />
            Apply Filters
          </button>
          {(filterDate || filterEmployee) && (
            <button className="btn btn-secondary" onClick={clearFilters}>
              <X size={18} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Calendar size={20} />
            Attendance Records ({attendanceRecords.length})
          </h2>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Mark Attendance
          </button>
        </div>

        {attendanceRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar size={64} />
            </div>
            <h3 className="empty-state-title">No attendance records found</h3>
            <p className="empty-state-description">
              {filterDate || filterEmployee
                ? 'Try adjusting your filters or clear them to see all records.'
                : 'Start marking attendance for your employees.'}
            </p>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} />
              Mark Attendance
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <span className="badge badge-primary">{record.employee_id}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={16} />
                        <strong>{record.employee_name || 'Unknown'}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={16} />
                        {formatDate(record.date)}
                      </div>
                    </td>
                    <td>
                      {record.status === 'Present' ? (
                        <span className="badge badge-success">
                          <CheckCircle size={14} />
                          Present
                        </span>
                      ) : (
                        <span className="badge badge-danger">
                          <XCircle size={14} />
                          Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MarkAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAttendance}
      />
    </div>
  );
}

export default Attendance;

import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../api';
import { Plus, Trash2, Mail, Briefcase, User, Users, X, AlertCircle, Loader } from 'lucide-react';

function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employee_id.trim()) newErrors.employee_id = 'Employee ID is required';
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.department.trim()) newErrors.department = 'Department is required';
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
      await employeeAPI.create(formData);
      onSuccess();
      onClose();
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
      setErrors({});
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to create employee';
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
          <div className="modal-header-content">
            <h2>Add New Employee</h2>
            <p>Fill in the details below to add a new employee.</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
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
              <label className="form-label required">Employee ID</label>
              <input
                type="text"
                name="employee_id"
                className={`form-input ${errors.employee_id ? 'error' : ''}`}
                value={formData.employee_id}
                onChange={handleChange}
                placeholder="e.g., EMP001"
              />
              {errors.employee_id && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.employee_id}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label required">Full Name</label>
              <input
                type="text"
                name="full_name"
                className={`form-input ${errors.full_name ? 'error' : ''}`}
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g., John Doe"
              />
              {errors.full_name && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.full_name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label required">Email Address</label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., john.doe@company.com"
              />
              {errors.email && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label required">Department</label>
              <select
                name="department"
                className={`form-select ${errors.department ? 'error' : ''}`}
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select department</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="IT">IT</option>
              </select>
              {errors.department && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.department}
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
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (!confirm('Are you sure you want to delete this employee? This will also delete all associated attendance records.')) {
      return;
    }

    setDeletingId(employeeId);
    try {
      await employeeAPI.delete(employeeId);
      await fetchEmployees();
    } catch (err) {
      alert('Failed to delete employee: ' + (err.response?.data?.detail || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Employee Management</h1>
        <p className="page-description">Manage your organization's employees</p>
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
          <h2 className="card-title">
            <Users size={20} />
            All Employees ({employees.length})
          </h2>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Add Employee
          </button>
        </div>

        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <User size={64} />
            </div>
            <h3 className="empty-state-title">No employees yet</h3>
            <p className="empty-state-description">
              Get started by adding your first employee to the system.
            </p>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} />
              Add First Employee
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <span className="badge badge-primary">{employee.employee_id}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={16} />
                        <strong>{employee.full_name}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        <Mail size={16} />
                        {employee.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Briefcase size={16} />
                        {employee.department}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(employee.employee_id)}
                        disabled={deletingId === employee.employee_id}
                      >
                        {deletingId === employee.employee_id ? (
                          <>
                            <Loader size={14} className="spinner" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 size={14} />
                            Delete
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEmployees}
      />
    </div>
  );
}

export default Employees;

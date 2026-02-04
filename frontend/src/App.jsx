import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, Calendar, LayoutDashboard, Building2 } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import './index.css';

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-brand">
        <Building2 size={28} />
        HRMS Lite
      </Link>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          <li className="sidebar-nav-item">
            <Link 
              to="/" 
              className={`sidebar-nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          </li>
          <li className="sidebar-nav-item">
            <Link 
              to="/employees" 
              className={`sidebar-nav-link ${isActive('/employees') ? 'active' : ''}`}
            >
              <Users size={20} />
              Employees
            </Link>
          </li>
          <li className="sidebar-nav-item">
            <Link 
              to="/attendance" 
              className={`sidebar-nav-link ${isActive('/attendance') ? 'active' : ''}`}
            >
              <Calendar size={20} />
              Attendance
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        HRMS Lite v1.0
      </div>
    </aside>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

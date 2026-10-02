import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Nav.css';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dsaOpen, setDsaOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="nav-logo" style={{backgroundColor:'#F97316'}}>V</span>
          <span style={{color:'#F97316'}}>Visual</span> DSA
        </Link>

        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '\u2715' : '\u2630'}
        </button>

        <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>

          <div className="nav-dropdown" onMouseEnter={() => setDsaOpen(true)} onMouseLeave={() => setDsaOpen(false)}>
            <button className="nav-link nav-dropdown-trigger">
              DSA Topics
              <span className={`dropdown-arrow ${dsaOpen ? 'open' : ''}`}>&#9662;</span>
            </button>
            <div className={`nav-dropdown-menu ${dsaOpen ? 'active' : ''}`}>
              <Link to="/basics" onClick={() => { setMenuOpen(false); setDsaOpen(false); }}>DSA Basics</Link>
              <Link to="/array" onClick={() => { setMenuOpen(false); setDsaOpen(false); }}>Array</Link>
              <Link to="/linkedlist" onClick={() => { setMenuOpen(false); setDsaOpen(false); }}>Linked List</Link>
              <Link to="/stack" onClick={() => { setMenuOpen(false); setDsaOpen(false); }}>Stack</Link>
              <Link to="/queue" onClick={() => { setMenuOpen(false); setDsaOpen(false); }}>Queue</Link>
              <Link to="/circular-queue" onClick={() => { setMenuOpen(false); setDsaOpen(false); }}>Circular Queue</Link>
              <Link to="/searching" onClick={() => { setMenuOpen(false); setDsaOpen(false); }}>Searching</Link>
              <Link to="/sorting" onClick={() => { setMenuOpen(false); setDsaOpen(false); }}>Sorting</Link>
            </div>
          </div>

          <Link to="/practice" className={`nav-link ${isActive('/practice') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Practice</Link>

          <Link to="/progress" className={`nav-link ${isActive('/progress') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>My Progress</Link>

          <Link to="/certificate" className={`nav-link ${isActive('/certificate') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            🎓 Certificate
          </Link>

          <div className="nav-auth">
            {isAuthenticated ? (
              <>
                <span className="nav-user">Hi, {user?.username}</span>
                <button className="btn-nav-logout" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="btn-nav-login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/auth/register" className="btn-nav-register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

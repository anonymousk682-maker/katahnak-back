import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5';

export default function Header() {
  const nav = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  async function handleLogout() {
    try {
      await logout();
      nav('/admin/login');
    } catch (err) {
      console.warn(err);
      nav('/admin/login');
    }
  }

  const handleMobileNavClick = (e) => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
      setIsMobileMenuOpen(false);
    }
  };

  const getNavLinkClass = (path, isAnchor = false) => {
    if (isAnchor) {
      const isActiveAnchor = location.hash === path;
      return isActiveAnchor ? 'text-white font-bold' : 'text-[var(--muted)] hover:text-white transition';
    }

    if (path === '/') {
      const isActiveHome = location.pathname === '/' && location.hash === '';
      return isActiveHome ? 'text-white font-bold' : 'text-[var(--muted)] hover:text-white transition';
    }

    const isActivePath = location.pathname.startsWith(path);
    return isActivePath ? 'text-white font-bold' : 'text-[var(--muted)] hover:text-white transition';
  };

  return (
    <header
      className="w-full py-4 shadow-2xl fixed top-0 left-0 z-50"
      style={{
        background: 'rgba(15, 23, 42, 0.98)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="container-max flex items-center justify-between h-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-extrabold text-2xl tracking-wider" style={{ color: 'var(--accent-light)' }}>
            PoetryHub
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className={getNavLinkClass('/')}>Home</Link>
            <Link to="/poems" className={getNavLinkClass('/poems')}>Poems</Link>
            <a href="/#about" className={getNavLinkClass('#about', true)}>About</a>
            <a href="/#contact" className={getNavLinkClass('#contact', true)}>Contact</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="text-sm text-[var(--muted)]">Checking…</div>
          ) : isAuthenticated ? (
            <>
              <div className="text-sm text-[var(--muted)] hidden sm:block">Hi, {user?.username || 'Admin'}</div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[var(--accent)] text-slate-900 shadow-md hover:bg-[var(--accent-light)] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-[var(--accent)] text-white hover:bg-white/10 transition"
            >
              Admin Login
            </Link>
          )}

          <button
            className="md:hidden p-2 text-white/90 hover:text-white transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <IoCloseOutline className="h-6 w-6" /> : <IoMenuOutline className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav
          className=" inset-0 
      backdrop-blur-2xl 
      z-40 
      p-6 
     top-[67px] md:hidden
    "
          onClick={handleMobileNavClick}
        >
          {/* FULL COVER BACKDROP — NO PADDING */}
          <div className="absolutere inset-0 bg-slate-900/95 backdrop-blur-xl"></div>

          {/* MENU CONTENT (padding only here) */}
          <ul className="relative flex flex-col space-y-6 p-6 text-xl">
            <li>
              <Link to="/" className="block py-3 px-4 bg-slate-800/70 rounded-lg">
                Home
              </Link>
            </li>
            <li>
              <Link to="/poems" className="block py-3 px-4 bg-slate-800/70 rounded-lg">
                Poems
              </Link>
            </li>
            <li>
              <a href="/#about" className="block py-3 px-4 bg-slate-800/70 rounded-lg">
                About
              </a>
            </li>
            <li>
              <a href="/#contact" className="block py-3 px-4 bg-slate-800/70 rounded-lg">
                Contact
              </a>
            </li>

            <li className="pt-4 border-t border-white/10">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block w-full py-3 px-4 rounded-full font-semibold bg-[var(--accent)] text-slate-900 shadow-md"
                >
                  Logout ({user?.username || 'User'})
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  className="block w-full py-3 px-4 rounded-full font-semibold border border-[var(--accent)] text-white"
                >
                  Admin Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}

    </header>
  );
}

// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaPlus, FaList, FaTrashAlt, FaEdit, FaTimes, FaBars } from 'react-icons/fa'; 
import api from '../../services/api';

// --- Reusable Dashboard Components (unchanged) ---

const FormRow = ({ label, children }) => (
  <div className="flex flex-col space-y-2 mb-4">
    <label className="text-sm font-semibold text-white/80">{label}</label>
    {children}
  </div>
);

// --- Confirmation Modal Component (unchanged) ---
function ConfirmationModal({ 
  title, 
  message, 
  onConfirm, 
  onClose, 
  confirmText = "Confirm",
  confirmColor = "bg-red-600 hover:bg-red-700" 
}) {
  return (
    // Backdrop
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4" 
      style={{
        background:'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(5px)'
      }}
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="card-surface rounded-2xl p-6 shadow-2xl relative w-full max-w-sm text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-[var(--muted)] hover:text-white transition p-2 rounded-full hover:bg-white/10"
          aria-label="Close"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        {/* Header */}
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--accent-light)' }}>
          {title}
        </h3>
        
        {/* Message Body */}
        <p className="text-sm text-white/80 mb-6">{message}</p>
        
        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 rounded-full text-sm font-semibold text-white transition ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Poem Modal Component (for View) (unchanged) ---
function PoemModal({ poem: initial, onClose }) {
    const [poem, setPoem] = useState(initial);

    useEffect(() => {
        // fetch detail to ensure latest (increments view)
        api.get(`/poems/${initial._id}`).then(r => setPoem(r.data.poem)).catch(console.error);
    }, [initial._id]);

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4" 
            style={{ background:'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}
            onClick={onClose}
        >
            <div 
                className="card-surface rounded-2xl p-6 md:p-10 text-white shadow-2xl relative w-full"
                style={{
                    maxWidth:'900px', 
                    maxHeight:'90vh', 
                    overflowY:'auto',
                }}
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-[var(--muted)] hover:text-white transition p-2 rounded-full hover:bg-white/10"
                    aria-label="Close"
                >
                    <FaTimes className="h-6 w-6" />
                </button>
                <header className="mb-6 pb-4 border-b border-[var(--card-border)]">
                    <h2 className="text-3xl sm:text-4xl font-extrabold leading-snug" style={{ color: 'var(--accent-light)' }}>
                        {poem.title}
                    </h2>
                    <p className="mt-2 text-xl italic text-[var(--muted)] font-serif">
                        — {poem.author}
                    </p>
                </header>
                <div 
                    className="text-lg text-white/90 leading-relaxed max-w-full mx-auto" 
                    style={{ whiteSpace:'pre-wrap', fontFamily: 'Merriweather, Georgia, serif', lineHeight: '1.8' }}
                >
                    {poem.body}
                </div>
                <div className="mt-8 pt-4 border-t border-[var(--card-border)] text-sm text-[var(--muted)] flex justify-end">
                    Views: {poem.views || initial.views || 0}
                </div>
            </div>
        </div>
    );
}

// --- Sidebar Component (MODIFIED) ---

function Sidebar({ active, setActive, isMobile, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
    { id: 'create', label: 'Create Poem', icon: FaPlus },
    { id: 'manage', label: 'Manage Poems', icon: FaList },
  ];

  const handleClick = (id) => {
    setActive(id);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Backdrop for Mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-16 left-0 h-full w-64 p-6 z-40 transition-transform duration-300 ease-in-out ${
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
        } md:w-56`} 
        style={{ background: 'rgba(15, 23, 42, 0.98)', borderRight: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* 💡 NEW: Header/Close Button visible only on mobile when open */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h3 className="text-xl font-bold" style={{ color: 'var(--accent-light)' }}>Menu</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full text-white hover:bg-white/10 transition"
            aria-label="Close Sidebar Menu"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-3">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition duration-200 text-sm font-semibold ${
                  isActive 
                    ? 'bg-[var(--accent)] text-slate-900 shadow-lg' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-10 text-xs text-[var(--muted)]">PoetryHub Admin</div>
      </aside>
    </>
  );
}

// --- Poem Creation Component (unchanged) ---
function CreatePoem({ form, setForm, handleCreate, loading }) {
    const onFile = (e) => {
        setForm(f => ({ ...f, image: e.target.files[0] }));
    };
    
    return (
        <section className="card-surface rounded-2xl p-8 shadow-xl">
            <h3 className="text-3xl font-bold mb-6" style={{ color: 'var(--accent)' }}>New Poem Entry</h3>
            <form onSubmit={handleCreate}>
              <FormRow label="Title">
                <input 
                  className="input-field p-3 rounded-lg" 
                  type="text" 
                  value={form.title} 
                  onChange={e=>setForm({...form, title:e.target.value})} 
                  required 
                />
              </FormRow>
              <FormRow label="Author">
                <input 
                  className="input-field p-3 rounded-lg" 
                  type="text" 
                  value={form.author} 
                  onChange={e=>setForm({...form, author:e.target.value})} 
                />
              </FormRow>
              <FormRow label="Body">
                <textarea 
                  className="input-field p-3 rounded-lg" 
                  rows={8} 
                  value={form.body} 
                  onChange={e=>setForm({...form, body:e.target.value})} 
                  required 
                />
              </FormRow>
              <FormRow label="Tags (JSON array)">
                <input 
                  className="input-field p-3 rounded-lg" 
                  type="text" 
                  placeholder='e.g., ["love", "nature"]'
                  value={form.tags} 
                  onChange={e=>setForm({...form, tags:e.target.value})} 
                />
              </FormRow>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-t border-[var(--card-border)] pt-4">
                <label className="flex items-center gap-2 text-white/90 cursor-pointer mb-4 sm:mb-0">
                  <input 
                    type="checkbox" 
                    checked={form.isFeatured} 
                    onChange={e=>setForm({...form, isFeatured:e.target.checked})} 
                    className="h-4 w-4 rounded border-gray-600 bg-white/10 text-[var(--accent)] focus:ring-[var(--accent)]"
                  /> 
                  Feature on Homepage
                </label>
                <div className="flex flex-col">
                  <FormRow label="Image (Optional)">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={onFile} 
                      className="text-sm text-[var(--muted)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-slate-900 hover:file:bg-[var(--accent-light)] transition"
                    />
                  </FormRow>
                </div>
              </div>

              <button 
                className="w-full mt-4 px-6 py-3 rounded-full text-lg font-semibold bg-[var(--accent)] text-slate-900 shadow-md hover:bg-[var(--accent-light)] transition disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Poem'}
              </button>
            </form>
        </section>
    );
}

// --- Poem Management Component (unchanged) ---
function ManagePoems({ poems, handleDelete, setPoemToDelete, setPoemToView, loading }) {
    return (
        <section className="card-surface rounded-2xl p-8 shadow-xl">
            <h3 className="text-3xl font-bold mb-6 border-b border-[var(--card-border)] pb-2" style={{ color: 'var(--accent)' }}>
              Poem Archive ({poems.length})
            </h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {poems.length === 0 && <p className="text-[var(--muted)]">No poems found.</p>}
              {poems.map(p => (
                <div 
                  key={p._id} 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-[var(--input-bg)] hover:bg-white/10 transition border border-[var(--card-border)]"
                >
                  <div className="truncate mb-2 sm:mb-0 sm:max-w-[50%]">
                    <strong className="text-white block truncate">{p.title}</strong>
                    <div className="text-xs text-[var(--muted)]">{p.author} — <span className="text-sm text-[var(--accent)]">{p.views || 0} views</span></div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button 
                      className="px-3 py-1 text-sm rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition"
                      onClick={() => setPoemToView(p)} 
                    >
                      View
                    </button>
                    {/* Placeholder for Edit feature */}
                    <button 
                      className="px-3 py-1 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                      onClick={() => alert(`Edit feature for ${p.title} coming soon!`)}
                    >
                      <FaEdit className="inline h-3 w-3 mr-1" /> Edit
                    </button>
                    <button 
                      onClick={() => setPoemToDelete(p)} 
                      className="px-3 py-1 text-sm rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      <FaTrashAlt className="inline h-3 w-3 mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
        </section>
    );
}

// --- Analytics Component (unchanged) ---
function Analytics({ analytics }) {
    return (
        <section className="card-surface rounded-2xl p-8 shadow-xl">
            <h3 className="text-3xl font-bold mb-6 border-b border-[var(--card-border)] pb-2" style={{ color: 'var(--accent)' }}>
              Website Analytics (Last 7 Days)
            </h3>
            <ul className="space-y-4 text-sm text-[var(--muted)]">
                {analytics.length === 0 ? (
                    <li className="text-sm">No analytics data available.</li>
                ) : (
                    analytics.map(a => (
                        <li key={a.date} className="flex justify-between items-center bg-[var(--input-bg)] p-3 rounded-lg border border-[var(--card-border)]">
                            <span className="text-white/80">{a.date}:</span>
                            <strong className="text-xl font-extrabold text-[var(--accent-light)]">{a.uniqueVisitors} unique</strong>
                        </li>
                    ))
                )}
            </ul>
        </section>
    );
}

// --- Main Dashboard Component (MODIFIED) ---

export default function AdminDashboard() {
  const [poems, setPoems] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title:'', author:'', body:'', tags:'[]', isFeatured:false, image: null });
  const [activeSection, setActiveSection] = useState('analytics'); 
  const [poemToDelete, setPoemToDelete] = useState(null); 
  const [poemToView, setPoemToView] = useState(null); 
  const [successMessage, setSuccessMessage] = useState(null);
  // 💡 STATE: To control mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const nav = useNavigate();

  // 💡 REFINED: Use a state/effect to track window width changes for better responsiveness logic
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); 
  
  useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ... (loadAll, useEffect, handleCreate, handleDelete logic remains the same)

  async function loadAll() {
    setLoading(true);
    try {
      const [pResp, aResp] = await Promise.all([
        api.get('/poems?limit=200&page=1'),
        api.get('/admin/analytics/daily-unique?days=7')
      ]);
      setPoems(pResp.data.poems);
      setAnalytics(aResp.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        nav('/admin/login', { replace: true });
      } else {
        if (err.response?.status !== 401) alert('Failed to load dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
        const data = new FormData();
        data.append('title', form.title);
        data.append('author', form.author);
        data.append('body', form.body);
        data.append('tags', form.tags);
        data.append('isFeatured', form.isFeatured);
        if (form.image) data.append('image', form.image);

        const r = await api.post('/admin/poems', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        
        setSuccessMessage(`Successfully created the poem: "${r.data.poem.title}"`);
        
        setForm({ title:'', author:'', body:'', tags:'[]', isFeatured:false, image:null });
        setActiveSection('manage'); 
        await loadAll();
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Create failed'); 
    } finally {
        setLoading(false);
    }
  }

  async function handleDelete(id) {
    setLoading(true); 
    setPoemToDelete(null); 
    try {
      await api.delete(`/admin/poems/${id}`);
      setSuccessMessage("Poem successfully deleted.");
      await loadAll();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  // --- Render Logic for Active Section ---
  const renderContent = () => {
    if (loading && poems.length === 0 && analytics.length === 0) {
        return <div className="text-center text-xl text-[var(--accent)] mt-20">Loading Dashboard...</div>;
    }
    
    switch (activeSection) {
      case 'analytics':
        return <Analytics analytics={analytics} />;
      case 'create':
        return <CreatePoem form={form} setForm={setForm} handleCreate={handleCreate} loading={loading} />;
      case 'manage':
        return <ManagePoems 
                  poems={poems} 
                  handleDelete={handleDelete} 
                  setPoemToDelete={setPoemToDelete} 
                  setPoemToView={setPoemToView} 
                  loading={loading} 
                />;
      default:
        return <Analytics analytics={analytics} />;
    }
  };

  return (
    <div className="text-white min-h-screen">
      
      {/* 1. Sidebar (Fixed to the left) */}
      <Sidebar 
        active={activeSection} 
        setActive={setActiveSection} 
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      {/* 2. Main Content Area (Mobile: full width, Desktop: offset by ml-56) */}
      <div className="mt-16 p-4 md:p-8 md:ml-56"> 
        
        {/* Mobile Header/Toggle Button */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-3xl font-extrabold" style={{ color: 'var(--accent-light)' }}>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h2>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            aria-label="Open Sidebar Menu"
          >
            <FaBars className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop Header */}
        <h2 className="hidden md:block text-4xl font-extrabold mb-8" style={{ color: 'var(--accent-light)' }}>
          Dashboard Overview
        </h2>
        
        {renderContent()}
      </div>
      
      {/* Renders the Delete Confirmation Modal */}
      {poemToDelete && (
        <ConfirmationModal
          title={`Confirm Deletion: ${poemToDelete.title}`}
          message={`Are you sure you want to permanently delete the poem "${poemToDelete.title}" by ${poemToDelete.author}? This cannot be undone.`}
          onConfirm={() => handleDelete(poemToDelete._id)}
          onClose={() => setPoemToDelete(null)}
          confirmText="Yes, Delete Permanently"
        />
      )}

      {/* Renders the Poem Viewing Modal */}
      {poemToView && (
        <PoemModal poem={poemToView} onClose={() => setPoemToView(null)} />
      )}

      {/* Renders the Success Modal */}
      {successMessage && (
        <ConfirmationModal
          title="Success! 🎉"
          message={successMessage}
          onConfirm={() => setSuccessMessage(null)}
          onClose={() => setSuccessMessage(null)}
          confirmText="OK"
          confirmColor="bg-emerald-600 hover:bg-emerald-700"
        />
      )}
    </div>
  );
}
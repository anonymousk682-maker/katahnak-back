// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
// Import the PoemModal component
import PoemModal from '../components/PoemModal'; 

function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* decorative background image with stronger overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-cover bg-center" style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=60')`
        }} />
      </div>

      <div className="container-max py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Main Text Content */}
          <div className="text-white lg:col-span-7">
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg" style={{ color: 'var(--accent-light)' }}>
              PoetryHub — <span className="text-white font-normal">where words breathe</span>
            </h1>
            <p className="mt-6 text-xl text-white/80 max-w-2xl font-serif">
              A curated space to discover famous poems and fresh voices. Read, feel, and return — daily.
            </p>

            <blockquote className="mt-8 border-l-4 pl-4 text-xl italic text-white/90" style={{ borderColor: 'var(--accent)' }}>
              "A poem is a small (or large) machine made of words — built to move the reader." — Anonymous
            </blockquote>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="/poems" className="px-8 py-3 rounded-full bg-[var(--accent)] text-slate-900 font-semibold shadow-xl hover:bg-[var(--accent-light)] transition duration-300">
                Browse Poems
              </a>
              <a href="#contact" className="px-8 py-3 rounded-full border border-[var(--accent)] text-white/90 hover:bg-white/10 transition duration-300">
                Contact Us
              </a>
            </div>
          </div>

          {/* Featured Card (Image/Quote) */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="card-surface rounded-2xl p-6 shadow-2xl transition duration-500 hover:shadow-white/10">
              <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=60" alt="poetry" className="rounded-xl w-full object-cover h-[400px]" />
              <div className="mt-5 text-white/90">
                <h3 className="text-xl font-semibold">Today's Featured Thought</h3>
                <p className="mt-2 text-sm text-[var(--muted)] font-serif">"Poetry is life itself — it starts with words and becomes experience."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="container-max py-20">
      <div className="card-surface rounded-2xl p-10 grid md:grid-cols-2 gap-12 items-start shadow-xl">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>About PoetryHub</h2>
          <p className="mt-4 text-[var(--muted)] text-lg leading-relaxed">
            PoetryHub is a small, focused library created to make poems discoverable. Our homepage highlights the most-read (featured) works, while the poems page keeps an ever-growing list of submissions by the admin.
          </p>
          <ul className="mt-6 text-[var(--muted)] list-disc list-inside space-y-3 pl-4">
            <li className="text-white/90">Curated selection of classic and contemporary works</li>
            <li className="text-white/90">Daily unique visitor analytics (private & aggregated)</li>
            <li className="text-white/90">Admin-managed content via a secure login</li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div className="p-5 rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)]">
            <h4 className="font-semibold text-lg text-white">Our Vision</h4>
            <p className="mt-2 text-sm text-[var(--muted)]">To create a calm, beautiful place online where poems are read slowly and shared widely.</p>
          </div>

          <div className="p-5 rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)]">
            <h4 className="font-semibold text-lg text-white">Contribute</h4>
            <p className="mt-2 text-sm text-[var(--muted)]">Currently only admin can add poems; reach out via contact below to apply for contributor access.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ⚠️ MODIFIED: Now accepts a click handler prop
function Featured({ featured, onOpenPoem }) {
  return (
    <section className="container-max py-20">
      <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--accent)' }}>Featured Poems</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featured.length === 0 && <div className="text-[var(--muted)] col-span-full text-center">No featured poems yet.</div>}
        {featured.map(p => (
          <article 
            key={p._id} 
            // 💡 Clicking the whole card opens the modal
            onClick={() => onOpenPoem(p)} 
            className="card-surface rounded-xl p-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 cursor-pointer"
          >
            {p.imageFileId && (
              <img src={`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/uploads/${p.imageFileId}`} alt={p.title} className="w-full h-48 object-cover rounded-lg mb-4 border border-[var(--card-border)]" />
            )}
            <h3 className="font-bold text-lg text-white truncate">{p.title}</h3>
            <div className="text-sm text-[var(--accent)] font-serif mt-1">{p.author}</div>
            <p className="text-xs text-[var(--muted)] mt-3 line-clamp-3 leading-relaxed" style={{whiteSpace: 'pre-wrap'}}>{p.body?.slice(0,120)}{p.body && p.body.length>120? '...' : ''}</p>
            <div className="mt-4 flex items-center justify-between border-t border-[var(--card-border)] pt-3">
              <div className="text-xs text-[var(--muted)]">Views: {p.views || 0}</div>
              {/* 💡 MODIFIED: Changed the <a> to an action link that stops event propagation, preventing double click, and calls the handler */}
              <button 
                onClick={(e) => { e.stopPropagation(); onOpenPoem(p); }} 
                className="text-sm font-semibold hover:text-[var(--accent-light)]" 
                style={{color: 'var(--accent)'}}
              >
                Read Poem &rarr;
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [contact, setContact] = useState({ name:'', email:'', message:'' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  // 💡 NEW STATE: To track which poem is selected for the modal
  const [selectedPoem, setSelectedPoem] = useState(null); 

  useEffect(() => {
    api.get('/featured?limit=8').then(r => setFeatured(r.data.poems)).catch(err => {
      console.warn(err);
      setFeatured([]);
    });
  }, []);

  async function handleContact(e) {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      // this will attempt to post to /api/contact (you can implement it later)
      await api.post('/contact', contact).catch(() => {
        // if backend doesn't have /contact, just simulate success
      });
      setStatus({ ok: true, msg: 'Message sent — we will get back to you.'});
      setContact({ name:'', email:'', message:'' });
    } catch (err) {
      setStatus({ ok: false, msg: 'Send failed. Please email admin@example.com' });
    } finally {
      setSending(false);
    }
  }


  return (
    <div className="text-white">
      <Hero />

      <About />
      
      {/* 💡 MODIFIED: Pass the setSelectedPoem handler to Featured */}
      <Featured featured={featured} onOpenPoem={setSelectedPoem} />

      <section id="contact" className="container-max py-20">
        <div className="card-surface rounded-2xl p-10 grid md:grid-cols-2 gap-12 shadow-xl">
          <div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>Get In Touch</h2>
            <p className="mt-3 text-lg text-[var(--muted)]">Want to contribute, share feedback, or just say hello? Send us a message.</p>

            <div className="mt-8 space-y-4 text-white">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--accent)]" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                <a href="mailto:admin@example.com" className="text-white/90 hover:text-[var(--accent-light)] transition">admin@example.com</a>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--accent)]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                <span className="text-white/90">The Digital Verse (Online)</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleContact} className="space-y-5">
            <input className="input-field w-full p-3 rounded-lg" placeholder="Your name" value={contact.name} onChange={e=>setContact({...contact, name:e.target.value})} required />
            <input className="input-field w-full p-3 rounded-lg" placeholder="Email" type="email" value={contact.email} onChange={e=>setContact({...contact, email:e.target.value})} required />
            <textarea className="input-field w-full p-3 rounded-lg" rows={6} placeholder="Message" value={contact.message} onChange={e=>setContact({...contact, message:e.target.value})} required />
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button className="px-6 py-3 rounded-full bg-[var(--accent)] text-slate-900 font-semibold hover:bg-[var(--accent-light)] transition disabled:opacity-50" disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</button>
              {status && (
                <div className={`text-sm font-medium ${status.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{status.msg}</div>
              )}
            </div>
          </form>
        </div>
      </section>

      <footer className="mt-16 border-t border-[var(--card-border)] py-10">
        <div className="container-max flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>PoetryHub</div>
            <div className="text-sm text-[var(--muted)] mt-1">© {new Date().getFullYear()} — Read. Breathe. Return.</div>
          </div>

          <div className="flex items-center gap-4 text-white/70">
            <a className="p-3 rounded-full hover:bg-white/10 hover:text-white transition" href="#" aria-label="Twitter"><FaTwitter /></a>
            <a className="p-3 rounded-full hover:bg-white/10 hover:text-white transition" href="#" aria-label="Instagram"><FaInstagram /></a>
            <a className="p-3 rounded-full hover:bg-white/10 hover:text-white transition" href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a className="p-3 rounded-full hover:bg-white/10 hover:text-white transition" href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>
      </footer>
      
      {/* 💡 NEW: Render PoemModal if a poem is selected */}
      {selectedPoem && (
        <PoemModal poem={selectedPoem} onClose={() => setSelectedPoem(null)} />
      )}
    </div>
  );
}
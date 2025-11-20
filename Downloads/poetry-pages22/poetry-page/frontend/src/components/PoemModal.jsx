import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function PoemModal({ poem: initial, onClose }) {
  const [poem, setPoem] = useState(initial);

  useEffect(() => {
    // fetch detail to ensure latest (increments view)
    // NOTE: This effect runs once when the modal is opened
    api.get(`/poems/${initial._id}`).then(r => setPoem(r.data.poem)).catch(console.error);
  }, [initial._id]);

  return (
    // Backdrop - Full screen, dark, slightly blurred overlay
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4" 
      style={{
        background:'rgba(0,0,0,0.85)', // Stronger dark backdrop
        backdropFilter: 'blur(5px)'
      }}
      onClick={onClose} // Close when clicking outside the content
    >
      {/* Modal Content Container */}
      <div 
        className="card-surface rounded-2xl p-6 md:p-10 text-white shadow-2xl relative w-full"
        style={{
          width:'95%', 
          maxWidth:'900px', 
          maxHeight:'90vh', // Adjusted to 90vh for better fit on screens
          overflowY:'auto', // Enable vertical scrolling for the content
        }}
        onClick={e => e.stopPropagation()} // Prevent click from bubbling up to the backdrop
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-[var(--muted)] hover:text-white transition p-2 rounded-full hover:bg-white/10"
          aria-label="Close"
        >
          {/* Using an X icon for aesthetic */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <header className="mb-6 pb-4 border-b border-[var(--card-border)]">
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-snug" style={{ color: 'var(--accent-light)' }}>
            {poem.title}
          </h2>
          <p className="mt-2 text-xl italic text-[var(--muted)] font-serif">
            — {poem.author}
          </p>
        </header>
        
        {/* Poem Body - Enhanced for Reading */}
        <div 
          className="text-lg text-white/90 leading-relaxed max-w-full mx-auto" 
          style={{ 
            whiteSpace:'pre-wrap', 
            fontFamily: 'Merriweather, Georgia, serif', // Use a beautiful serif font for the poem body
            lineHeight: '1.8' // Increase line height for better readability
          }}
        >
          {poem.body}
        </div>
        
        {/* Footer/Meta Info */}
        <div className="mt-8 pt-4 border-t border-[var(--card-border)] text-sm text-[var(--muted)] flex justify-end">
            Views: {poem.views || initial.views || 0}
        </div>

      </div>
    </div>
  );
}
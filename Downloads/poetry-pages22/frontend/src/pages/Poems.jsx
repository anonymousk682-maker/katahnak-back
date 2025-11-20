import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PoemCard from '../components/PoemCard'; // Assuming this component exists
import PoemModal from '../components/PoemModal'; // Assuming this component exists

export default function Poems() {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/poems?limit=100&page=1')
      .then(r => setPoems(r.data.poems))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="text-white min-h-screen">
      
      {/* 🏞️ Hero Section/Header */}
      <section className="bg-slate-900/50 border-b border-[var(--card-border)] py-16">
        <div className="container-max">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--accent-light)' }}>
            The Complete Archive
          </h1>
          <p className="mt-2 text-lg text-[var(--muted)]">
            Explore every poem published on PoetryHub. Click any card to read the full text.
          </p>
        </div>
      </section>

      {/* 🖼️ Poems Grid Section */}
      <section className="container-max py-12 md:py-16">
        
        {loading && (
          <div className="text-center text-xl text-[var(--accent)] py-16">
            Loading poems...
            {/* Simple Tailwind Spinner (optional) */}
            <div className="animate-spin h-6 w-6 border-4 border-t-[var(--accent)] border-white/20 rounded-full mx-auto mt-4"></div>
          </div>
        )}

        {!loading && poems.length === 0 && (
          <div className="text-center text-xl text-[var(--muted)] py-16">
            No poems found in the archive. Check back later!
          </div>
        )}
        
        {/* Responsive Grid Layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {poems.map(p => 
            // NOTE: The 'PoemCard' component must be styled to match the aesthetic (e.g., using 'card-surface', rounded corners, and accent colors for text).
            <PoemCard 
              key={p._id} 
              poem={p} 
              onOpen={() => setSelected(p)} 
              // Passing aesthetic classes to the card wrapper for consistency
              className="card-surface rounded-xl p-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 cursor-pointer"
            />
          )}
        </div>
      </section>

      {/* 📖 Poem Modal */}
      {/* NOTE: PoemModal should use a full-screen, semi-transparent backdrop and a centered, card-surface modal panel for full aesthetic effect. */}
      {selected && <PoemModal poem={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
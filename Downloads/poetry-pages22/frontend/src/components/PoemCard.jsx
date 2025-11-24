import React from 'react';

// Environment variable for image loading base URL (must be included)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

/**
 * UPDATED: PoemCard component using Tailwind CSS to match the style of the
 * featured cards on the Home page.
 */
export default function PoemCard({ poem, onOpen }) {
    const imgSrc = poem.imageFileId ? `${API_BASE}/uploads/${poem.imageFileId}` : null;
    
    // Determine the snippet for the card body (copied from Home's Featured logic)
    const bodySnippet = poem.body ? poem.body.slice(0, 120) : '';
    const hasMore = poem.body && poem.body.length > 120;

    return (
        <article 
            key={poem._id}
            // 1. Outer Card Container Styling (Matching Home's article tag)
            onClick={onOpen}
            className="card-surface rounded-xl p-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 cursor-pointer"
        >
            {imgSrc && (
                // 2. Image Styling (Matching Home's img tag)
                <img 
                    src={imgSrc} 
                    alt={poem.title} 
                    className="w-full h-48 object-cover rounded-lg mb-4 border border-[var(--card-border)]" 
                />
            )}
            
            {/* 3. Title Styling */}
            <h3 className="font-bold text-lg text-white truncate">{poem.title}</h3>
            
            {/* 4. Author Styling */}
            <div className="text-sm text-[var(--accent)] font-serif mt-1">{poem.author}</div>
            
            {/* 5. Poem Snippet (copied from Home's p tag) */}
            <p className="text-xs text-[var(--muted)] mt-3 line-clamp-3 leading-relaxed" style={{whiteSpace: 'pre-wrap'}}>
                {bodySnippet}
                {hasMore ? '...' : ''}
            </p>
            
            {/* 6. Footer/Metadata Section (Matching Home's div tag) */}
            <div className="mt-4 flex items-center justify-between border-t border-[var(--card-border)] pt-3">
                {/* Views */}
                <div className="text-xs text-[var(--muted)]">Views: {poem.views || 0}</div>
                
                {/* Featured/Read Poem Button - Using the "Read Poem" button style for consistency */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onOpen(poem); }} 
                    className="text-sm font-semibold hover:text-[var(--accent-light)]" 
                    style={{color: 'var(--accent)'}}
                >
                    Read Poem &rarr;
                </button>
            </div>
        </article>
    );
}

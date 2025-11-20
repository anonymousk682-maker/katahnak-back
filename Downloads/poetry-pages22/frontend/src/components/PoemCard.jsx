import React from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function PoemCard({ poem, onOpen }) {
  const imgSrc = poem.imageFileId ? `${API_BASE}/uploads/${poem.imageFileId}` : null;

  return (
    <div className="card" style={{ cursor: onOpen ? 'pointer' : 'default' }} onClick={onOpen}>
      {imgSrc && <img src={imgSrc} alt={poem.title} style={{ width:'100%', height:150, objectFit:'cover', borderRadius:8 }} />}
      <h3 style={{ margin:'12px 0 6px' }}>{poem.title}</h3>
      <div className="small">{poem.author}</div>
      <div style={{ marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div className="small">Views: {poem.views || 0}</div>
        {poem.isFeatured && <div style={{ background:'#fde68a', padding:'4px 8px', borderRadius:6, fontSize:12 }}>Featured</div>}
      </div>
    </div>
  );
}

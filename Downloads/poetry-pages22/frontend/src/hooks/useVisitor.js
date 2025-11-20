import { useEffect } from 'react';
import api from '../services/api';

export default function useVisitor() {
  useEffect(() => {
    api.get('/visitor/check').catch(err => {
      // non-fatal
      console.warn('visitor check failed', err?.message || err);
    });
  }, []);
}

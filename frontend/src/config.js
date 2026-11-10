export const BACKEND_URL = 
  import.meta.env.VITE_BACKEND_URL || 
  (import.meta.env.DEV ? 'http://localhost:5001' : 'https://dynamic-portfolio-2ksm.onrender.com');

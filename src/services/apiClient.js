const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8002';
const REQUEST_TIMEOUT = 90000; // 90 segundos para servicios en reposo

export const apiClient = {
  async post(path, body, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || REQUEST_TIMEOUT);
    
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${res.status}: ${text}`);
      }
      return res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('El servicio está tardando demasiado en responder. Por favor, intenta de nuevo.');
      }
      throw err;
    }
  },
  async get(path, params, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || REQUEST_TIMEOUT);
    
    try {
      const url = new URL(`${API_BASE}${path}`);
      Object.entries(params || {}).forEach(([k,v]) => url.searchParams.set(k, v));
      const res = await fetch(url.toString(), {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${res.status}: ${text}`);
      }
      return res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('El servicio está tardando demasiado en responder. Por favor, intenta de nuevo.');
      }
      throw err;
    }
  }
};

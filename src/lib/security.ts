// ─────────────────────────────────────────────────────────────────────────────
// Freedom Hub - Security Hardening Module
// ─────────────────────────────────────────────────────────────────────────────
// 
// Protection against:
// - XSS (Cross-Site Scripting)
// - CSRF (Cross-Site Request Forgery)
// - Clickjacking
// - DDoS (Rate Limiting)
// - Data Leaks
// - Brute Force
// ─────────────────────────────────────────────────────────────────────────────

import { logger } from './logger';

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT SECURITY POLICY (CSP)
// ─────────────────────────────────────────────────────────────────────────────

export const getCSP = (): string => {
  const isDevelopment = import.meta.env.DEV;
  
  return [
    // Default policy
    `default-src 'self'`,
    
    // Scripts
    `script-src 'self'${isDevelopment ? " 'unsafe-eval'" : ''} 'wasm-unsafe-eval'`,
    
    // Styles
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    
    // Images
    `img-src 'self' data: https: blob:`,
    
    // Fonts
    `font-src 'self' https://fonts.gstatic.com`,
    
    // Connect (AJAX, WebSocket)
    `connect-src 'self' https://*.supabase.co https://*.openrouter.ai https://api.mymemory.translated.net ws: wss:`,
    
    // Media
    `media-src 'self' blob:`,
    
    // Object (disable Flash, etc.)
    `object-src 'none'`,
    
    // Frame (prevent clickjacking)
    `frame-ancestors 'none'`,
    
    // Base URI
    `base-uri 'self'`,
    
    // Form Action
    `form-action 'self'`,
    
    // Upgrade insecure requests
    'upgrade-insecure-requests',
    
    // Block mixed content
    'block-all-mixed-content',
  ].join('; ');
};

export const applyCSP = () => {
  const csp = getCSP();
  
  // Set CSP meta tag
  const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (meta) {
    meta.setAttribute('content', csp);
  } else {
    const newMeta = document.createElement('meta');
    newMeta.setAttribute('http-equiv', 'Content-Security-Policy');
    newMeta.setAttribute('content', csp);
    document.head.appendChild(newMeta);
  }
  
  logger.info('CSP applied', { csp });
};

// ─────────────────────────────────────────────────────────────────────────────
// RATE LIMITING (Client-side)
// ─────────────────────────────────────────────────────────────────────────────

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

const rateLimitStores: Map<string, { count: number; resetTime: number }> = new Map();

export const createRateLimiter = (config: RateLimitConfig) => {
  return (key: string = 'default'): { allowed: boolean; remaining: number; resetIn: number } => {
    const now = Date.now();
    const store = rateLimitStores.get(key);
    
    if (!store || now > store.resetTime) {
      // Reset or create new window
      rateLimitStores.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs };
    }
    
    if (store.count >= config.maxRequests) {
      // Rate limit exceeded
      const resetIn = store.resetTime - now;
      logger.warn('Rate limit exceeded', { key, resetIn });
      return { allowed: false, remaining: 0, resetIn };
    }
    
    // Increment counter
    store.count++;
    rateLimitStores.set(key, store);
    
    return {
      allowed: true,
      remaining: config.maxRequests - store.count,
      resetIn: store.resetTime - now,
    };
  };
};

// Predefined rate limiters
export const rateLimiters = {
  // API calls: 100 requests per minute
  api: createRateLimiter({ windowMs: 60000, maxRequests: 100, message: 'Too many API requests' }),
  
  // Login attempts: 5 per 15 minutes
  login: createRateLimiter({ windowMs: 900000, maxRequests: 5, message: 'Too many login attempts' }),
  
  // Message sending: 30 per minute
  messages: createRateLimiter({ windowMs: 60000, maxRequests: 30, message: 'Too many messages' }),
  
  // File uploads: 10 per minute
  uploads: createRateLimiter({ windowMs: 60000, maxRequests: 10, message: 'Too many uploads' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// XSS PROTECTION
// ─────────────────────────────────────────────────────────────────────────────

export const sanitizeHTML = (html: string): string => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove dangerous elements
  const dangerous = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'];
  dangerous.forEach(tag => {
    const elements = temp.getElementsByTagName(tag);
    for (let i = elements.length - 1; i >= 0; i--) {
      elements[i].parentNode?.removeChild(elements[i]);
    }
  });
  
  // Remove dangerous attributes
  const allElements = temp.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    ['onclick', 'onerror', 'onload', 'onmouseover', 'onsubmit', 'onfocus', 'onblur'].forEach(attr => {
      el.removeAttribute(attr);
    });
    
    // Remove javascript: URLs
    if (el.hasAttribute('href')) {
      const href = el.getAttribute('href');
      if (href?.toLowerCase().startsWith('javascript:')) {
        el.removeAttribute('href');
      }
    }
  }
  
  return temp.innerHTML;
};

export const escapeHTML = (str: string): string => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// ─────────────────────────────────────────────────────────────────────────────
// CSRF PROTECTION
// ─────────────────────────────────────────────────────────────────────────────

export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const getCSRFToken = (): string => {
  let token = sessionStorage.getItem('csrf_token');
  
  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem('csrf_token', token);
  }
  
  return token;
};

export const validateCSRFToken = (token: string): boolean => {
  const stored = getCSRFToken();
  return token === stored;
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA ENCRYPTION (Client-side)
// ─────────────────────────────────────────────────────────────────────────────

export const encryptData = async (data: string, password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataEncoded = encoder.encode(data);
  const passwordEncoded = encoder.encode(password);
  
  // Generate key from password
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordEncoded,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('freedom-hub-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  // Encrypt
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataEncoded
  );
  
  // Combine IV and encrypted data
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), iv.length);
  
  // Convert to base64
  return btoa(String.fromCharCode(...result));
};

export const decryptData = async (encryptedData: string, password: string): Promise<string> => {
  // Convert from base64
  const data = new Uint8Array(
    atob(encryptedData)
      .split('')
      .map(c => c.charCodeAt(0))
  );
  
  const encoder = new TextEncoder();
  const passwordEncoded = encoder.encode(password);
  
  // Generate key from password
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordEncoded,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('freedom-hub-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  
  // Extract IV and encrypted data
  const iv = data.slice(0, 12);
  const encrypted = data.slice(12);
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY HEADERS
// ─────────────────────────────────────────────────────────────────────────────

export const applySecurityHeaders = () => {
  // Apply CSP
  applyCSP();
  
  // Set other security headers (via meta tags where possible)
  const headers = [
    { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
    { 'http-equiv': 'X-Frame-Options', content: 'DENY' },
    { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' },
    { 'http-equiv': 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
    { 'http-equiv': 'Permissions-Policy', content: 'geolocation=(), microphone=(), camera=()' },
  ];
  
  headers.forEach(header => {
    const meta = document.querySelector(`meta[http-equiv="${header['http-equiv']}"]`);
    if (meta) {
      meta.setAttribute('content', header.content);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.setAttribute('http-equiv', header['http-equiv']);
      newMeta.setAttribute('content', header.content);
      document.head.appendChild(newMeta);
    }
  });
  
  logger.info('Security headers applied');
};

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGGING
// ─────────────────────────────────────────────────────────────────────────────

interface SecurityEvent {
  type: 'login_attempt' | 'csrf_violation' | 'rate_limit' | 'xss_attempt' | 'encryption';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  details: Record<string, any>;
}

export const logSecurityEvent = (event: SecurityEvent) => {
  const events = JSON.parse(localStorage.getItem('security_audit') || '[]');
  events.push({
    ...event,
    timestamp: new Date().toISOString(),
  });
  
  // Keep last 1000 events
  localStorage.setItem('security_audit', JSON.stringify(events.slice(-1000)));
  
  // Log critical events immediately
  if (event.severity === 'critical' || event.severity === 'high') {
    logger.error(`Security Event: ${event.type}`, event.details);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

export const initSecurity = () => {
  // Apply security headers
  applySecurityHeaders();
  
  // Log initialization
  logSecurityEvent({
    type: 'encryption',
    severity: 'low',
    timestamp: new Date().toISOString(),
    details: { action: 'security_initialized' },
  });
  
  logger.info('Security module initialized');
};

export default {
  initSecurity,
  getCSP,
  rateLimiters,
  sanitizeHTML,
  escapeHTML,
  getCSRFToken,
  validateCSRFToken,
  encryptData,
  decryptData,
  logSecurityEvent,
};

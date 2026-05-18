const TOKEN_KEY = 'product_api_jwt'

/**
 * @returns {string}
 */
export function getStoredToken() {
  if (typeof sessionStorage === 'undefined') return ''
  return sessionStorage.getItem(TOKEN_KEY) || ''
}

/**
 * @param {string} token
 */
export function setStoredToken(token) {
  if (typeof sessionStorage === 'undefined') return
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token)
  } else {
    sessionStorage.removeItem(TOKEN_KEY)
  }
}

/**
 * @returns {Record<string, string>}
 */
export function authHeaders() {
  const t = getStoredToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

/**
 * @returns {string} API origin without trailing slash
 */
export function getApiBase() {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (typeof raw !== 'string' || !raw.trim()) {
    return ''
  }
  return raw.replace(/\/+$/, '')
}

/**
 * @param {string} path - e.g. "/products" or "products"
 */
export function apiUrl(path) {
  const base = getApiBase()
  if (!base) {
    throw new Error('VITE_API_BASE_URL is not set. Copy .env.example to .env and adjust the value.')
  }
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

import { apiUrl, authHeaders, setStoredToken } from './client.js'

/**
 * @param {Response} res
 * @returns {Promise<unknown>}
 */
async function parseJsonBody(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

/**
 * @param {Response} res
 * @returns {Promise<unknown>}
 */
async function handleResponse(res) {
  const data = await parseJsonBody(res)
  if (!res.ok) {
    const msg = data && typeof data === 'object' && 'message' in data ? data.message : res.statusText
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
  }
  return data
}

/**
 * @param {string} email
 * @param {string} password
 * @param {string} [name]
 */
export async function register(email, password, name) {
  const res = await fetch(apiUrl('/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  })
  const data = await handleResponse(res)
  if (data && typeof data === 'object' && 'token' in data && typeof data.token === 'string') {
    setStoredToken(data.token)
  }
  return data
}

/**
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  const res = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await handleResponse(res)
  if (data && typeof data === 'object' && 'token' in data && typeof data.token === 'string') {
    setStoredToken(data.token)
  }
  return data
}

export function logout() {
  setStoredToken('')
}

/**
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function fetchMe(options = {}) {
  const { signal } = options
  const res = await fetch(apiUrl('/auth/me'), {
    headers: { ...authHeaders() },
    signal
  })
  return handleResponse(res)
}

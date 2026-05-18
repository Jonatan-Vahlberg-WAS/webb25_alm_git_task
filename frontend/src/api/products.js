import { apiUrl, authHeaders } from './client.js'

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
 * @param {{ page?: number, limit?: number, name?: string }} [query]
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<unknown[]>}
 */
export async function fetchProducts(query = {}, options = {}) {
  const { page = 1, limit = 10, name } = query
  const { signal } = options
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  })
  if (name && name.trim()) {
    params.set('name', name.trim())
  }
  const res = await fetch(`${apiUrl('/products')}?${params}`, { signal })
  const data = await handleResponse(res)
  return Array.isArray(data) ? data : []
}

/**
 * @param {Record<string, unknown>} body
 */
export async function createProduct(body) {
  const res = await fetch(apiUrl('/products'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body)
  })
  return handleResponse(res)
}

/**
 * @param {string} id
 */
export async function deleteProduct(id) {
  const res = await fetch(apiUrl(`/products/${id}`), { method: 'DELETE', headers: { ...authHeaders() } })
  return handleResponse(res)
}

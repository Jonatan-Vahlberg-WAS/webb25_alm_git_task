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
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<unknown[]>}
 */
export async function fetchCategories(options = {}) {
  const { signal } = options
  const res = await fetch(apiUrl('/categories'), { signal })
  const data = await handleResponse(res)
  return Array.isArray(data) ? data : []
}

/**
 * @param {string} id
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function fetchCategoryById(id, options = {}) {
  const { signal } = options
  const res = await fetch(apiUrl(`/categories/${id}`), { signal })
  return handleResponse(res)
}

/**
 * @param {{ name: string, description?: string, isActive?: boolean }} body
 */
export async function createCategory(body) {
  const res = await fetch(apiUrl('/categories'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body)
  })
  return handleResponse(res)
}

/**
 * @param {string} id
 * @param {Record<string, unknown>} body
 */
export async function updateCategory(id, body) {
  const res = await fetch(apiUrl(`/categories/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body)
  })
  return handleResponse(res)
}

/**
 * @param {string} id
 */
export async function deleteCategory(id) {
  const res = await fetch(apiUrl(`/categories/${id}`), {
    method: 'DELETE',
    headers: { ...authHeaders() }
  })
  if (!res.ok) {
    const data = await parseJsonBody(res)
    const msg = data && typeof data === 'object' && 'message' in data ? data.message : res.statusText
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
  }
}

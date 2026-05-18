import { useCallback, useEffect, useState } from 'react'
import { getApiBase, getStoredToken } from './api/client.js'
import { createProduct, deleteProduct, fetchProducts } from './api/products.js'
import { createCategory, deleteCategory, fetchCategories, updateCategory } from './api/categories.js'
import { fetchMe, login, logout, register } from './api/auth.js'
import './App.css'

const CATEGORY_ENUM = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home' }
]

/**
 * @param {unknown} c
 */
function categoryLabel(c) {
  if (c == null) return ''
  if (typeof c === 'object' && c !== null && 'name' in c) return String(/** @type {{ name?: string }} */ (c).name)
  return String(c)
}

function App() {
  const hasApi = Boolean(getApiBase())
  const [user, setUser] = useState(/** @type {{ id: string, email: string, name?: string } | null} */ (null))
  const [authBusy, setAuthBusy] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authModalError, setAuthModalError] = useState(/** @type {string | null} */ (null))
  const [authMode, setAuthMode] = useState(/** @type {'login' | 'register'} */ ('login'))
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')

  const [products, setProducts] = useState(/** @type {unknown[]} */ ([]))
  const [categories, setCategories] = useState(/** @type {unknown[]} */ ([]))
  const [loading, setLoading] = useState(false)
  const [catLoading, setCatLoading] = useState(false)
  const [error, setError] = useState(/** @type {string | null} */ (null))
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [nameFilter, setNameFilter] = useState('')
  const [nameFilterApplied, setNameFilterApplied] = useState('')

  const [formName, setFormName] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategory, setFormCategory] = useState('')

  const [newCatName, setNewCatName] = useState('electronics')
  const [newCatDesc, setNewCatDesc] = useState('')
  const [newCatActive, setNewCatActive] = useState(true)

  const [editingCat, setEditingCat] = useState(/** @type {null | { _id: string, name: string, description?: string, isActive?: boolean }} */ (null))

  const [saving, setSaving] = useState(false)

  const loadCategories = useCallback(async (signal) => {
    if (!getApiBase()) return
    setCatLoading(true)
    try {
      const opts = signal ? { signal } : {}
      const list = await fetchCategories(opts)
      setCategories(Array.isArray(list) ? list : [])
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      setCategories([])
      setError(e instanceof Error ? e.message : 'Could not load categories')
    } finally {
      setCatLoading(false)
    }
  }, [])

  const refreshSession = useCallback(async () => {
    if (!getApiBase() || !getStoredToken()) {
      setUser(null)
      return
    }
    try {
      const me = await fetchMe()
      if (me && typeof me === 'object' && 'email' in me) {
        setUser(/** @type {typeof user} */ (me))
      }
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    if (!hasApi) return
    const t = window.setTimeout(() => {
      void refreshSession()
    }, 0)
    return () => window.clearTimeout(t)
  }, [hasApi, refreshSession])

  const load = useCallback(
    async (signal) => {
      if (!getApiBase()) {
        setProducts([])
        return
      }
      setLoading(true)
      setError(null)
      try {
        const opts = signal ? { signal } : {}
        const list = await fetchProducts({ page, limit, name: nameFilterApplied || undefined }, opts)
        setProducts(Array.isArray(list) ? list : [])
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setError(e instanceof Error ? e.message : 'Request failed')
        setProducts([])
      } finally {
        setLoading(false)
      }
    },
    [page, limit, nameFilterApplied]
  )

  useEffect(() => {
    if (!hasApi) return
    const ac = new AbortController()
    const t = window.setTimeout(() => {
      void load(ac.signal)
    }, 0)
    return () => {
      window.clearTimeout(t)
      ac.abort()
    }
  }, [hasApi, load])

  useEffect(() => {
    if (!hasApi) return
    const ac = new AbortController()
    const t = window.setTimeout(() => {
      void loadCategories(ac.signal)
    }, 0)
    return () => {
      window.clearTimeout(t)
      ac.abort()
    }
  }, [hasApi, loadCategories, user])

  useEffect(() => {
    if (!authOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setAuthOpen(false)
        setAuthModalError(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [authOpen])

  const openAuthModal = (mode) => {
    setAuthMode(mode)
    setAuthModalError(null)
    setAuthPassword('')
    setAuthOpen(true)
  }

  const closeAuthModal = () => {
    setAuthOpen(false)
    setAuthModalError(null)
    setAuthBusy(false)
    setAuthPassword('')
  }

  const onApplyFilter = (e) => {
    e.preventDefault()
    setPage(1)
    setNameFilterApplied(nameFilter)
  }

  const activeCategories = categories.filter((c) => {
    if (!c || typeof c !== 'object') return false
    const rec = /** @type {{ isActive?: boolean }} */ (c)
    return rec.isActive !== false
  })

  const onCreate = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Log in to create products.')
      return
    }
    const price = Number(formPrice)
    if (!formName.trim() || Number.isNaN(price)) {
      setError('Name and a numeric price are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const body = {
        name: formName.trim(),
        price,
        description: formDescription.trim()
      }
      if (formCategory) {
        body.category = formCategory
      }
      await createProduct(body)
      setFormName('')
      setFormPrice('')
      setFormDescription('')
      setFormCategory('')
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create product')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (id) => {
    if (!user) {
      setError('Log in to delete products.')
      return
    }
    if (!window.confirm('Delete this product?')) return
    setError(null)
    try {
      await deleteProduct(id)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete product')
    }
  }

  const onAuthSubmit = async (e) => {
    e.preventDefault()
    if (!authEmail.trim() || !authPassword) {
      setAuthModalError('Email and password are required.')
      return
    }
    setAuthBusy(true)
    setAuthModalError(null)
    try {
      if (authMode === 'register') {
        await register(authEmail.trim(), authPassword, authName.trim() || undefined)
      } else {
        await login(authEmail.trim(), authPassword)
      }
      const me = await fetchMe()
      setUser(me && typeof me === 'object' ? /** @type {typeof user} */ (me) : null)
      setAuthPassword('')
      closeAuthModal()
      await loadCategories()
    } catch (e) {
      setAuthModalError(e instanceof Error ? e.message : 'Authentication failed')
    } finally {
      setAuthBusy(false)
    }
  }

  const onLogout = () => {
    logout()
    setUser(null)
    setError(null)
  }

  const onCreateCategory = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Log in to manage categories.')
      return
    }
    setCatLoading(true)
    setError(null)
    try {
      await createCategory({
        name: newCatName,
        description: newCatDesc.trim(),
        isActive: newCatActive
      })
      setNewCatDesc('')
      setNewCatActive(true)
      await loadCategories()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create category')
    } finally {
      setCatLoading(false)
    }
  }

  const onDeleteCategory = async (id) => {
    if (!user) return
    if (!window.confirm('Delete this category? Products may still reference it.')) return
    setError(null)
    try {
      await deleteCategory(id)
      await loadCategories()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete category')
    }
  }

  const onSaveCategoryEdit = async (e) => {
    e.preventDefault()
    if (!editingCat || !user) return
    setCatLoading(true)
    setError(null)
    try {
      await updateCategory(editingCat._id, {
        name: editingCat.name,
        description: editingCat.description ?? '',
        isActive: editingCat.isActive !== false
      })
      setEditingCat(null)
      await loadCategories()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update category')
    } finally {
      setCatLoading(false)
    }
  }

  if (!hasApi) {
    return (
      <div className='app shell'>
        <header className='header'>
          <h1>Products</h1>
        </header>
        <main className='main'>
          <div className='card notice'>
            <p>
              <strong>API URL missing.</strong> Copy <code>frontend/.env.example</code> to <code>frontend/.env</code> and set{' '}
              <code>VITE_API_BASE_URL</code> to your Express server (for example <code>http://localhost:3000</code>). Then restart{' '}
              <code>npm run dev</code>.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className='app shell'>
      <header className='header header-with-actions'>
        <div className='header-brand'>
          <h1>Products & categories</h1>
          <p className='muted'>Using API at {getApiBase()}</p>
        </div>
        <div className='header-actions'>
          {user ? (
            <div className='user-chip'>
              <span className='user-chip-text' title={user.email}>
                <span className='user-chip-label'>Signed in</span>
                <span className='user-chip-email'>{user.email}</span>
                {user.name ? <span className='user-chip-name'>{user.name}</span> : null}
              </span>
              <button type='button' className='btn-logout' onClick={onLogout}>
                Log out
              </button>
            </div>
          ) : (
            <>
              <button type='button' className='btn-header-ghost' onClick={() => openAuthModal('login')}>
                Log in
              </button>
              <button type='button' className='btn-header-primary' onClick={() => openAuthModal('register')}>
                Create account
              </button>
            </>
          )}
        </div>
      </header>

      {authOpen ? (
        <div
          className='modal-backdrop'
          role='presentation'
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeAuthModal()
          }}
        >
          <div className='modal-dialog' role='dialog' aria-modal='true' aria-labelledby='auth-modal-title'>
            <button type='button' className='modal-close' aria-label='Close' onClick={closeAuthModal}>
              ×
            </button>
            <p className='modal-kicker'>{authMode === 'login' ? 'Welcome back' : 'Get started'}</p>
            <h2 id='auth-modal-title' className='modal-title'>
              {authMode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className='modal-sub'>
              {authMode === 'login'
                ? 'Manage categories and products with a secure session.'
                : 'Choose a password with at least 8 characters.'}
            </p>

            <div className='auth-segment' role='tablist'>
              <button
                type='button'
                role='tab'
                aria-selected={authMode === 'login'}
                className={`auth-segment-btn ${authMode === 'login' ? 'is-active' : ''}`}
                onClick={() => {
                  setAuthMode('login')
                  setAuthModalError(null)
                }}
              >
                Log in
              </button>
              <button
                type='button'
                role='tab'
                aria-selected={authMode === 'register'}
                className={`auth-segment-btn ${authMode === 'register' ? 'is-active' : ''}`}
                onClick={() => {
                  setAuthMode('register')
                  setAuthModalError(null)
                }}
              >
                Register
              </button>
            </div>

            <form className='auth-modal-form' onSubmit={onAuthSubmit}>
              {authModalError ? (
                <div className='auth-modal-error' role='alert'>
                  {authModalError}
                </div>
              ) : null}
              {authMode === 'register' ? (
                <label className='auth-field'>
                  <span>Name</span>
                  <input placeholder='Optional' value={authName} onChange={(ev) => setAuthName(ev.target.value)} autoComplete='name' />
                </label>
              ) : null}
              <label className='auth-field'>
                <span>Email</span>
                <input
                  type='email'
                  placeholder='you@example.com'
                  value={authEmail}
                  onChange={(ev) => setAuthEmail(ev.target.value)}
                  required
                  autoComplete='email'
                  autoFocus
                />
              </label>
              <label className='auth-field'>
                <span>Password</span>
                <input
                  type='password'
                  placeholder={authMode === 'register' ? 'At least 8 characters' : '••••••••'}
                  value={authPassword}
                  onChange={(ev) => setAuthPassword(ev.target.value)}
                  required
                  minLength={8}
                  autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                />
              </label>
              <button type='submit' className='btn-modal-submit' disabled={authBusy}>
                {authBusy ? 'Please wait…' : authMode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <main className='main'>
        {error ? (
          <div className='card error' role='alert'>
            {error}
          </div>
        ) : null}

        <section className='card'>
          <h2>Categories</h2>
          <p className='muted' style={{ marginTop: '-0.5rem', marginBottom: '0.75rem' }}>
            Loaded from <code>GET /categories</code>. Mutations require sign-in (JWT). Product dropdown uses active categories only.
          </p>
          {catLoading ? <p className='muted'>Loading categories…</p> : null}
          {!catLoading && categories.length === 0 ? <p className='muted'>No categories yet. Create one below (requires login).</p> : null}
          {categories.length > 0 ? (
            <table className='category-table'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Active</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {categories.map((raw) => {
                  const c = /** @type {{ _id: string, name: string, description?: string, isActive?: boolean }} */ (raw)
                  return (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.description ?? '—'}</td>
                      <td>{c.isActive === false ? 'No' : 'Yes'}</td>
                      <td>
                        <div className='row-actions'>
                          <button type='button' disabled={!user} onClick={() => setEditingCat({ ...c })}>
                            Edit
                          </button>
                          <button type='button' disabled={!user} onClick={() => onDeleteCategory(c._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : null}

          {editingCat ? (
            <form className='form-grid' style={{ marginTop: '1rem' }} onSubmit={onSaveCategoryEdit}>
              <h3 className='span-2' style={{ margin: 0, fontSize: '1rem' }}>
                Edit category
              </h3>
              <label>
                Name
                <select value={editingCat.name} onChange={(ev) => setEditingCat({ ...editingCat, name: ev.target.value })}>
                  {CATEGORY_ENUM.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Active
                <select
                  value={editingCat.isActive === false ? 'no' : 'yes'}
                  onChange={(ev) => setEditingCat({ ...editingCat, isActive: ev.target.value === 'yes' })}
                >
                  <option value='yes'>Yes</option>
                  <option value='no'>No</option>
                </select>
              </label>
              <label className='span-2'>
                Description
                <input value={editingCat.description ?? ''} onChange={(ev) => setEditingCat({ ...editingCat, description: ev.target.value })} />
              </label>
              <div className='form-actions span-2'>
                <button type='submit' disabled={catLoading || !user}>
                  Save
                </button>
                <button type='button' className='btn-secondary' onClick={() => setEditingCat(null)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : null}

          <form className='form-grid' style={{ marginTop: '1rem' }} onSubmit={onCreateCategory}>
            <h3 className='span-2' style={{ margin: 0, fontSize: '1rem' }}>
              New category
            </h3>
            <label>
              Name (enum)
              <select value={newCatName} onChange={(ev) => setNewCatName(ev.target.value)}>
                {CATEGORY_ENUM.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Active
              <select value={newCatActive ? 'yes' : 'no'} onChange={(ev) => setNewCatActive(ev.target.value === 'yes')}>
                <option value='yes'>Yes</option>
                <option value='no'>No</option>
              </select>
            </label>
            <label className='span-2'>
              Description
              <input value={newCatDesc} onChange={(ev) => setNewCatDesc(ev.target.value)} placeholder='Optional' />
            </label>
            <div className='form-actions span-2'>
              <button type='submit' disabled={catLoading || !user}>
                {catLoading ? 'Saving…' : 'Create category'}
              </button>
            </div>
          </form>
        </section>

        <section className='card'>
          <h2>Add product</h2>
          {!user ? <p className='muted'>Sign in to create products.</p> : null}
          <form className='form-grid' onSubmit={onCreate}>
            <label>
              Name
              <input value={formName} onChange={(ev) => setFormName(ev.target.value)} required disabled={!user} />
            </label>
            <label>
              Price
              <input type='number' min='0' step='0.01' value={formPrice} onChange={(ev) => setFormPrice(ev.target.value)} required disabled={!user} />
            </label>
            <label className='span-2'>
              Description
              <input value={formDescription} onChange={(ev) => setFormDescription(ev.target.value)} disabled={!user} />
            </label>
            <label>
              Category
              <select value={formCategory} onChange={(ev) => setFormCategory(ev.target.value)} disabled={!user}>
                <option value=''>No category</option>
                {activeCategories.map((raw) => {
                  const c = /** @type {{ _id: string, name: string }} */ (raw)
                  return (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  )
                })}
              </select>
            </label>
            <div className='form-actions'>
              <button type='submit' disabled={saving || !user}>
                {saving ? 'Saving…' : 'Create'}
              </button>
            </div>
          </form>
        </section>

        <section className='card'>
          <h2>Catalog</h2>
          <form className='filter-row' onSubmit={onApplyFilter}>
            <label className='grow'>
              Filter by name
              <input value={nameFilter} onChange={(ev) => setNameFilter(ev.target.value)} placeholder='Search text' />
            </label>
            <button type='submit'>Apply</button>
          </form>

          {loading ? <p className='muted'>Loading…</p> : null}

          {!loading && products.length === 0 ? <p className='muted'>No products on this page.</p> : null}

          <ul className='product-list'>
            {products.map((p) => {
              const row = /** @type {{ _id: string, name: string, price: number, description?: string, category?: unknown }} */ (p)
              return (
                <li key={row._id} className='product-row'>
                  <div>
                    <strong>{row.name}</strong>
                    <span className='muted'> · {row.price} kr</span>
                    {row.category ? <span className='tag'>{categoryLabel(row.category)}</span> : null}
                    {row.description ? <p className='desc'>{row.description}</p> : null}
                  </div>
                  <button type='button' className='danger' disabled={!user} onClick={() => onDelete(row._id)}>
                    Delete
                  </button>
                </li>
              )
            })}
          </ul>

          <div className='pager'>
            <button type='button' disabled={page <= 1 || loading} onClick={() => setPage((n) => Math.max(1, n - 1))}>
              Previous
            </button>
            <span className='muted'>Page {page}</span>
            <button type='button' disabled={loading || products.length < limit} onClick={() => setPage((n) => n + 1)}>
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

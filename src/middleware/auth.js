const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-jwt-secret-change-me'

/**
 * @param {import('mongoose').Types.ObjectId} userId
 * @returns {string}
 */
function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, JWT_SECRET, { expiresIn: '7d' })
}

/**
 * @param {string} token
 * @returns {{ sub: string }}
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' })
  }
  const raw = header.slice('Bearer '.length).trim()
  if (!raw) {
    return res.status(401).json({ message: 'Authentication required' })
  }
  try {
    const payload = verifyToken(raw)
    req.user = { id: payload.sub }
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = {
  signToken,
  verifyToken,
  requireAuth,
  JWT_SECRET
}

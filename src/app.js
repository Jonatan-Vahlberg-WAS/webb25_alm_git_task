const cors = require('cors')
const express = require('express')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/categories', categoryRoutes)
app.use('/users', userRoutes)

app.get('/', (req, res) => {
  res.json({
    'GET /': 'API directory (this document)',
    '/auth': {
      'POST /register': {
        description: 'Create a user account; returns a JWT',
        body: {
          email: 'required string (unique)',
          password: 'required string (min 8 characters)',
          name: 'optional string'
        }
      },
      'POST /login': {
        description: 'Log in with email and password; returns a JWT',
        body: {
          email: 'required string',
          password: 'required string'
        }
      },
      'GET /me': {
        description: 'Return the current user (requires Authorization: Bearer <token>)',
        auth: 'Bearer JWT'
      },
      'PUT /me': {
        description: 'Update profile fields for the current user',
        auth: 'Bearer JWT',
        body: {
          name: 'optional string',
          password: 'optional string (min 8 when provided; replaces password when set)'
        }
      }
    },
    '/products': {
      'GET /': {
        description: 'List products with optional filters, sort, and pagination',
        query: {
          name: 'optional string (partial, case-insensitive match on name)',
          minPrice: 'optional number',
          maxPrice: 'optional number',
          sort: 'optional: price | -price | name | -name (default: newest first)',
          page: 'optional positive integer (default 1)',
          limit: 'optional positive integer (default 5)'
        },
        auth: 'none'
      },
      'GET /:id': { description: 'Get one product by id', auth: 'none' },
      'POST /': {
        description: 'Create a product',
        auth: 'Bearer JWT',
        body: {
          name: 'required string',
          price: 'required number (>= 0)',
          description: 'optional string',
          category: 'optional Category ObjectId'
        }
      },
      'PUT /:id': {
        description: 'Update a product',
        auth: 'Bearer JWT',
        body: {
          name: 'string',
          price: 'number (>= 0)',
          description: 'string',
          category: 'Category ObjectId or null'
        }
      },
      'DELETE /:id': { description: 'Delete a product', auth: 'Bearer JWT' }
    },
    '/categories': {
      'GET /': { description: 'List categories', auth: 'none' },
      'GET /:id': { description: 'Get one category by id', auth: 'none' },
      'POST /': {
        description: 'Create a category',
        auth: 'Bearer JWT',
        body: {
          name: "required enum: 'electronics' | 'clothing' | 'home'",
          description: 'optional string',
          isActive: 'optional boolean (default true)'
        }
      },
      'PUT /:id': {
        description: 'Update a category',
        auth: 'Bearer JWT',
        body: {
          name: "enum: 'electronics' | 'clothing' | 'home'",
          description: 'string',
          isActive: 'boolean'
        }
      },
      'DELETE /:id': { description: 'Delete a category', auth: 'Bearer JWT' }
    }
  })
})

module.exports = app

// const http = require('http')
// const { MongoClient } = require('mongodb')
// const url = require('url')
// const querystring = require('querystring')

// const mongoUrl = ' mongodb://127.0.0.1:27017'
// const dbName = 'zombie_survival'
// const collectionName = 'users'

// // Create a MongoDB client
// const client = new MongoClient(mongoURI, { useUnifiedTopology: true })

// // Connect to MongoDB
// async function connectToMongoDB() {
//   try {
//     await client.connect()
//     console.log('Connected to MongoDB')
//   } catch (err) {
//     console.error('Error connecting to MongoDB:', err)
//   }
// }

// // Create HTTP server
// const server = http.createServer(async (req, res) => {
//   const { pathname } = url.parse(req.url)
//   const method = req.method

//   // Handle login request
//   if (pathname === '/login' && method === 'POST') {
//     let body = ''
//     req.on('data', (chunk) => {
//       body += chunk.toString()
//     })

//     req.on('end', async () => {
//       const { email, password } = querystring.parse(body)

//       // Validate input
//       if (!email || !password) {
//         res.writeHead(400, { 'Content-Type': 'application/json' })
//         res.end(JSON.stringify({ message: 'Email and password are required' }))
//         return
//       }

//       try {
//         const db = client.db(dbName)
//         const collection = db.collection(collectionName)

//         // Find user in MongoDB
//         const user = await collection.findOne({ email, password })

//         if (user) {
//           res.writeHead(200, { 'Content-Type': 'application/json' })
//           res.end(JSON.stringify({ message: 'Login successful', user }))
//         } else {
//           res.writeHead(401, { 'Content-Type': 'application/json' })
//           res.end(JSON.stringify({ message: 'Invalid email or password' }))
//         }
//       } catch (err) {
//         res.writeHead(500, { 'Content-Type': 'application/json' })
//         res.end(JSON.stringify({ message: 'Internal server error' }))
//       }
//     })
//   } else {
//     res.writeHead(404, { 'Content-Type': 'application/json' })
//     res.end(JSON.stringify({ message: 'Route not found' }))
//   }
// })

// // Start the server
// const PORT = 3000
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`)
//   connectToMongoDB()
// })
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zombie', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Database connection error:', err))

// User Model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})
const User = mongoose.model('User', UserSchema)

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '.')))

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'))
})

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user || user.password !== password) {
      return res.status(401).send('Invalid credentials')
    }
    res.redirect('/survival.html')
  } catch (err) {
    res.status(500).send('Server error')
  }
})

// Signup Route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).send('Email already exists')
    }

    const newUser = new User({ email, password })
    await newUser.save()
    res.redirect('/survival.html')
  } catch (err) {
    res.status(500).send('Server error')
  }
})

// Start Server
const PORT = process.env.PORT || 2000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

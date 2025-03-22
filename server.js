// // server.js
// const http = require('http')
// const url = require('url')
// const querystring = require('querystring')
// const fs = require('fs')
// const MongoClient = require('mongodb').MongoClient

// // MongoDB connection URL
// const mongoUrl = ' mongodb://127.0.0.1:27017'
// const dbName = 'zombie_survival'
// const collectionName = 'users'

// async function connectToMongo() {
//   const client = new MongoClient(mongoUrl)
//   await client.connect()
//   console.log('Connected successfully to MongoDB')
//   const db = client.db(dbName)
//   return db.collection(collectionName)
// }

// ;(async function startServer() {
//   const collection = await connectToMongo()

//   const server = http.createServer((req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*') // Allow cross-origin requests
//     res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

//     if (req.method === 'OPTIONS') {
//       // Respond to preflight requests
//       res.writeHead(200)
//       res.end()
//       return
//     }

//     if (req.method === 'POST' && req.url === '/login') {
//       let body = ''
//       req.on('data', (chunk) => {
//         body += chunk
//       })

//       req.on('end', async () => {
//         try {
//           const userData = JSON.parse(body)
//           const { email, password } = userData

//           // Validate user credentials against MongoDB
//           const user = await collection.findOne({ email: email })

//           if (user && user.password === password) {
//             // Passwords match, user is authenticated
//             res.writeHead(200, { 'Content-Type': 'application/json' })
//             res.end(JSON.stringify({ success: true }))
//           } else {
//             // Invalid credentials
//             res.writeHead(401, { 'Content-Type': 'application/json' })
//             res.end(
//               JSON.stringify({ success: false, message: 'Invalid credentials' })
//             )
//           }
//         } catch (error) {
//           console.error('Error processing login:', error)
//           res.writeHead(500, { 'Content-Type': 'application/json' })
//           res.end(
//             JSON.stringify({ success: false, message: 'Internal server error' })
//           )
//         }
//       })
//     } else {
//       res.writeHead(404, { 'Content-Type': 'text/plain' })
//       res.end('Not Found')
//     }
//   })

//   const port = 3000
//   server.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}/`)
//   })
// })()
const http = require('http')
const { MongoClient } = require('mongodb')
const url = require('url')
const querystring = require('querystring')

const mongoUrl = ' mongodb://127.0.0.1:27017'
const dbName = 'zombie_survival'
const collectionName = 'users'

// Create a MongoDB client
const client = new MongoClient(mongoURI, { useUnifiedTopology: true })

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect()
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url)
  const method = req.method

  // Handle login request
  if (pathname === '/login' && method === 'POST') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      const { email, password } = querystring.parse(body)

      // Validate input
      if (!email || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Email and password are required' }))
        return
      }

      try {
        const db = client.db(dbName)
        const collection = db.collection(collectionName)

        // Find user in MongoDB
        const user = await collection.findOne({ email, password })

        if (user) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: 'Login successful', user }))
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: 'Invalid email or password' }))
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Internal server error' }))
      }
    })
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Route not found' }))
  }
})

// Start the server
const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  connectToMongoDB()
})

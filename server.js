// require('dotenv').config()
// const express = require('express')
// const mongoose = require('mongoose')
// const path = require('path')
// const app = express()

// // Database Connection
// mongoose
//   .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zombie', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log('Database error:', err))

// // User Model
// const UserSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// })
// const User = mongoose.model('User', UserSchema)

// // Middleware
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())
// app.use(express.static(__dirname))

// // Routes
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'login.html'))
// })

// // app.get('/login', (req, res) => {
// //   res.sendFile(path.join(__dirname, 'login.html'))
// // })

// app.get('/survival', (req, res) => {
//   res.sendFile(path.join(__dirname, 'survival.html'))
// })

// app.get('/index2', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index2.html'))
// })

// // Auth Routes
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body
//     const user = await User.findOne({ email })

//     if (!user || user.password !== password) {
//       return res.status(401).send('Invalid credentials')
//     }
//     res.redirect('/survival.html')
//   } catch (err) {
//     res.status(500).send('Server error')
//   }
// })

// app.post('/signup', async (req, res) => {
//   try {
//     const { email, password } = req.body
//     const existingUser = await User.findOne({ email })

//     if (existingUser) {
//       return res.status(400).send('Email exists')
//     }

//     const newUser = new User({ email, password })
//     await newUser.save()
//     res.redirect('/survival.html')
//   } catch (err) {
//     res.status(500).send('Server error')
//   }
// })

// module.exports = app
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zombie')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Database connection error:', err)
    process.exit(1) // Exit process on connection failure
  })

// User Model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})
const User = mongoose.model('User', UserSchema)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.get('/survival', (req, res) => {
  res.sendFile(path.join(__dirname, 'survival.html'))
})

app.get('/index2', (req, res) => {
  res.sendFile(path.join(__dirname, 'index2.html'))
})

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || user.password !== password) {
      return res.status(401).send('Invalid credentials')
    }
    res.redirect('/survival.html')
  } catch (err) {
    res.status(500).send('Server error')
  }
})

app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).send('Email exists')
    }

    const newUser = new User({ email, password })
    await newUser.save()
    res.redirect('/survival.html')
  } catch (err) {
    res.status(500).send('Server error')
  }
})

module.exports = app

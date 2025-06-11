require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
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
module.exports = app

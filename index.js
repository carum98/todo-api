import express from 'express'
import { User, Auth } from './src/routes/index.js'
import { AuthMiddleware } from './src/middlewares/index.js'

// Constants
const PORT = process.env.PORT || 3000

// App
const app = express()

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', Auth)

// AuthMiddleware
app.use(AuthMiddleware)

// Routes
app.use('/users', User)

// Start
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
  
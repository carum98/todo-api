import express from 'express'
import cors from 'cors'
import { User, Auth, Todo, List } from './routes/index.js'
import { AuthMiddleware } from './middlewares/index.js'

// App
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/', Auth)

// AuthMiddleware
app.use(AuthMiddleware)

// Routes
app.use('/users', User)
app.use('/todos', Todo)
app.use('/lists', List)

export default app
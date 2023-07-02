import express from 'express'
import { User } from './src/routes/index.js'

// Constants
const PORT = process.env.PORT || 3000

// App
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use('/users', User)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
  
import express from 'express'
import mysql from 'mysql2'

// Constants
const PORT = process.env.PORT || 3000

// App
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/db', async (req, res) => {
    try {
        const connection = mysql.createConnection({
            host: 'db',
            port: 3306,
            user: 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        })

        await connection.connect()

        console.log('Connected to database')

        res.send('Connected to database')
    } catch (error) {
        console.error('Error connect to database', error)
    }
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
  
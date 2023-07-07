import app from './src/app.js'

// Constants
const PORT = process.env.PORT || 3000

// Start
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
  
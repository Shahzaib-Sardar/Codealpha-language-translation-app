const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const translateRoute = require('./routes/translate')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ok:true, message: 'Translation server running'}))
app.use('/translate', translateRoute)

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
  console.log(`Translation server listening on port ${PORT}`)
})

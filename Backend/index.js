const express = require('express')
require('dotenv').config()
const cors = require('cors')
const weatherApi = require("./routers/weather.js")
const { stringify } = require('flatted');

const app = express()
const mongoose = require('mongoose')
const port = 4000

//cors
const corsOptions = {
  origin: '*', // Allow all origins (use specific domains for stricter control)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies or authorization headers
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Connect to MongoDB
mongoose.connect(process.env.DB).then(() => console.log('Mongo Db Connected!'))

app.use("/api/", weatherApi)

app.get('/', async (req, res) => {
  res.send('GET request to the homepage')
})


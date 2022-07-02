const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const { URL_REGEX } = require('./controllers/convert')

// Include controller
const convertController = require('./controllers/convert')

const PORT = process.env.PORT || 3000

// connect mongoose with database
const MONGOOSE_URI = process.env.MONGODB_URI || 'mongodb://localhost/url'
console.log(`Connecting to database ${MONGOOSE_URI} ...`)
mongoose.connect(MONGOOSE_URI, { useNewUrlParser: true })

const db = mongoose.connection

// error connection
db.on('error', () => {
  console.log('mongodb error!')
})

// successful connection
db.once('open', () => {
  console.log('mongodb connected!')
  app.listen(PORT, () => {
    console.log(`URLSHORTENER_URL_REGEX: ${convertController.URL_REGEX}`)
    console.log(`URLSHORTENER_URL_ERROR_MESSAGE: ${convertController.URL_ERROR_MESSAGE}`)
    console.log(`App is running: http://localhost:${PORT}`)
  })
})

// Include user model
const Url = require('./models/url')

// set up handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// serve static files
app.use(express.static('public'))

app.get('/', convertController.getHome)

app.get('/convert/', convertController.getShortened)

app.get('/:shortenedUrl', convertController.getOriginal)

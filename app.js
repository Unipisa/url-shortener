const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

// Include controller
const convertController = require('./controllers/convert')
const homeController = require('./controllers/home')

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
    console.log(`App is running: https://localhost:${PORT}`)
  })
})

// Include user model
const Url = require('./models/url')

// set up handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// serve static files
app.use(express.static('public'))

app.get('/', homeController)

app.get('/convert', convertController.getShortened)

app.get('/:shortenedUrl', convertController.getOriginal)

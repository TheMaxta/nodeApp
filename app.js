const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db.js')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')

//load config 
dotenv.config({ path: "./config/config.env"})

//Passport Config
require('./config/passport')(passport)

connectDB()

const app = express()

//Logging
if (process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

//Handlebars
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Static Folder (using built in node path utility)//__dirname is path to current directory
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))


const PORT = process.env.PORT || 3000

app.listen(PORT,
     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
     )
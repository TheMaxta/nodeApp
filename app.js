
const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const mongoose = require('mongoose')
//const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db.js')

//load config 
dotenv.config({ path: "./config/config.env"})

//Passport  Config
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
//    store: new MongoStore({ mongooseConnection: mongoose.connection }),

  }))


//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Static Folder (using built in node path utility)//__dirname is path to current directory
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT,
     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
     )
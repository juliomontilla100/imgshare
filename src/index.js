const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport = require('passport')
const routes = require('./routes')
const morgan = require('morgan')

const app = express()

/* settings */
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    helpers: require('./config/helper'),
    extname: '.hbs'
}))
app.set('view engine', 'hbs')

/* middlewares */
app.use(express.static( path.join(__dirname, 'public') ))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: 'mongodb://127.0.0.1/imgshare'
    })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan('dev'))

/* routes */
app.use('/', routes)

require('./database')
app.listen(app.get('port'), (req,res) => console.log('server run on port ' + app.get('port')))
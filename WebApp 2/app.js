const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const expressSession = require("express-session");
const mongoose = require('mongoose')
const keys = require('./config/keys')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const challengeRoutes = require('./routes/challenges')
const todoRoutes = require('./routes/todo')
const Users = require('./models/User')
const passport = require('passport')
const uri = process.env.MONGODB_URI;


const app = express()

//DB CONNECTION
mongoose.connect(uri || keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log(`MongoDB connected!`);
})


//cors, morgan, bodyparser, ejs
app.use(require('cors')())
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set("view engine", "ejs")
app.use(express.static(__dirname + '/public'));


//cookie-session
app.use(expressSession({
    name: "Session",
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    secret: "key",
    resave: false,
    saveUninitialized: false
}))

app.use(cookieParser("key"))

app.use(passport.initialize())
app.use(passport.session())


require('./passport-setup')

//routes
app.use('/api/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/challenge', challengeRoutes)
app.use('/todo', todoRoutes)

//accessing by login
const redirectLogin = (req,res,next) => {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}

const redirectHome = (req,res,next) => {
    if (req.session.userId) {
        res.redirect('/profile')
    } else {
        next()
    }
}


//simple functions
app.get('/', (req, res) => {
    res.render("index", {req})
})

app.get('/login', redirectHome, (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
})

app.get('/register', redirectHome, (req, res) => {
    res.render("sign_up")
})

app.get('/quiz', (req, res) => {
    res.sendFile(__dirname + "/quiz.html")
})

app.get('/articles', (req, res) => {
    res.sendFile(__dirname + "/articles.html")
})

app.get('/pomodoro', function (req, res){
    res.sendFile(__dirname + "/pomodoro.html")
})

app.get('/profile',async  function(req,res ) {
    let user = await Users.findOne({_id: req.cookies.userId})
    res.render("profile", {user})
})

app.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/register' }),
    function(req, res) {
        res.redirect('/profile');
    });


module.exports = app
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const ejs = require('ejs')
const port = process.env.PORT || 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const asyncCatcher = require('./utils/async-catcher');
const ExpressError = require('./utils/express-error');
const session = require('express-session');
const passport = require('passport');
const passportLocalStrategy = require('passport-local');
const flash = require('connect-flash');

const postRoutes = require('./routes/post-routes');
const userRoutes = require('./routes/user-routes');

const databaseUrl = process.env.MONGO_ATLAS_URL || 'mongodb://127.0.0.1:27017/ristek-medsos';
const MongoStore = require('connect-mongo');


const Post = require('./models/post');
const User = require('./models/user');


// Mongoose
mongoose.set('strictQuery', false);
mongoose.connect(databaseUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error:"));
db.once('open', () => {
    console.log("Mongo database connected");
});



const app = express();
app.engine('ejs', ejsMate);
app.set('view-engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));

const store = MongoStore.create({
    mongoUrl: databaseUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'tempsecret'
    }
});

store.on('error', function (e) {
    console.log('Session store error'. e);
});

const sessionConfig = {
    store,
    secret: 'tempsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}


app.use(flash());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.use('/', userRoutes);
app.use('/home', postRoutes)

app.get('/getuser', async (req, res) => {
    const newUser = new User({email: 'tes@gmail.com', username: 'tesusername'});
    const regUser = await User.register(newUser, 'tespassword');
    res.send(regUser);
})

app.get('/api', asyncCatcher(async (req, res) => {
    const posts = await Post.find({});
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(posts));
}))



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
    const {message = 'Something went wrong!', statusCode = 500} = err;
    res.status(statusCode).render('error.ejs', {message});
})


app.listen(port, () => {
    console.log('Server is running on port', port);
});
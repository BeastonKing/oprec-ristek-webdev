const express = require('express');
const ejs = require('ejs')
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const asyncCatcher = require('./utils/async-catcher');
const ExpressError = require('./utils/express-error');
const session = require('express-session');
const postRoutes = require('./routes/post-routes');

const databaseUrl = process.env.MONGO_ATLAS_URL || 'mongodb://127.0.0.1:27017/ristek-medsos';
const Post = require('./models/post');


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

const sessionConfig = {
    secret: 'tempsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig));



app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get('/api', asyncCatcher(async (req, res) => {
    const posts = await Post.find({});
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(posts));
}))

app.use('/home', postRoutes)



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
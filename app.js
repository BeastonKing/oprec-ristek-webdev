const express = require('express');
const ejs = require('ejs')
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get('/api', async (req, res) => {
    const posts = await Post.find({});
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(posts));
})

app.get('/home', async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index.ejs', {posts})
});

app.get('/home/new', (req, res) => {
    res.render('posts/new.ejs')
})

app.post('/home', async (req, res) => {
    const date = new Date();
    const newPost = new Post({
        ...req.body.post,
        date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    });
    await newPost.save()
    res.redirect('/home')
});

app.get('/test', async (req, res) => {
    const newPost = new Post({
        body: 'test date',
        date: `10-10-2010`
    });
    await newPost.save()
    res.redirect('/home')
});

app.get('/home/:id', async (req, res) => {
    const findPost = await Post.findById(req.params.id);
    res.render('posts/show.ejs', {post: findPost});
})

app.get('/home/:id/edit', async (req, res) => {
    const findPost = await Post.findById(req.params.id);
    res.render('posts/edit.ejs', {post: findPost})
})

app.put('/home/:id', async (req, res) => {
    const {id} = req.params;
    const date = new Date();
    const updatedPost = await Post.findByIdAndUpdate(id, {
        ...req.body.post,
        date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    })
    res.redirect(`/home/${updatedPost._id}`);
})

app.delete('/home/:id', async (req, res) => {
    const {id} = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    res.redirect('/home') ;
})


app.listen(port, () => {
    console.log('Server is running on port', port);
});
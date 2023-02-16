const express = require('express');
const router = express.Router();
const asyncCatcher = require('../utils/async-catcher');
const ExpressError = require('../utils/express-error');
const Post = require('../models/post');
const {campgroundJoiSchema} = require('../utils/joi-schemas');
const {ensureLoggedIn, isAuthor, validatePost} = require('../utils/middleware');




router.get('/', asyncCatcher(async (req, res) => {
    const posts = await Post.find({}).populate('author');
    res.render('posts/index.ejs', {posts})
}));

router.get('/new', ensureLoggedIn, (req, res) => {
    res.render('posts/new.ejs')
})

router.post('/', ensureLoggedIn, validatePost, asyncCatcher(async (req, res) => {

    const date = new Date();
    const newPost = new Post({
        ...req.body.post,
        date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    });
    newPost.author = req.user._id;
    await newPost.save()
    res.redirect('/home')
}));



router.get('/:id', asyncCatcher(async (req, res) => {
    const findPost = await Post.findById(req.params.id).populate('author');
    if (!findPost) {
        req.flash('error', 'Post does not exist.');
        return res.redirect('/home')
    }
    res.render('posts/show.ejs', {post: findPost});
}))

router.get('/:id/edit', ensureLoggedIn, isAuthor, asyncCatcher(async (req, res) => {
    const findPost = await Post.findById(req.params.id);
    if (!findPost) {
        req.flash('error', 'Post does not exist.');
        return res.redirect('/home')
    }
    res.render('posts/edit.ejs', {post: findPost})
}))

router.put('/:id', ensureLoggedIn, isAuthor, validatePost, asyncCatcher(async (req, res) => {
    const date = new Date();
    const {id} = req.params;
    const updatedPost = await Post.findByIdAndUpdate(id, {
        ...req.body.post,
        date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    })
    res.redirect(`/home/${updatedPost._id}`);
}))

router.delete('/:id', ensureLoggedIn, isAuthor, asyncCatcher(async (req, res) => {
    const {id} = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    res.redirect('/home') ;
}))


module.exports = router;
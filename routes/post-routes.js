const express = require('express');
const router = express.Router();
const asyncCatcher = require('../utils/async-catcher');
const ExpressError = require('../utils/express-error');
const Post = require('../models/post');
const {campgroundJoiSchema} = require('../utils/joi-schemas');

const validatePost = (req, res, next) => {

    const {error}  = campgroundJoiSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(el => el.message).join(','), 400);
    } else next();
}


router.get('/', asyncCatcher(async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index.ejs', {posts})
}));

router.get('/new', (req, res) => {
    res.render('posts/new.ejs')
})

router.post('', validatePost, asyncCatcher(async (req, res) => {
    // if (!req.body.post) throw new ExpressError('Invalid Post Input!', 400);

    const date = new Date();
    const newPost = new Post({
        ...req.body.post,
        date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    });
    await newPost.save()
    res.redirect('/home')
}));



router.get('/:id', asyncCatcher(async (req, res) => {
    const findPost = await Post.findById(req.params.id);
    res.render('posts/show.ejs', {post: findPost});
}))

router.get('/:id/edit', asyncCatcher(async (req, res) => {
    const findPost = await Post.findById(req.params.id);
    res.render('posts/edit.ejs', {post: findPost})
}))

router.put('/:id', validatePost, asyncCatcher(async (req, res) => {
    // if (!req.body.post) throw new ExpressError('Invalid Post Input!', 400);
    const {id} = req.params;
    const date = new Date();
    const updatedPost = await Post.findByIdAndUpdate(id, {
        ...req.body.post,
        date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    })
    res.redirect(`/home/${updatedPost._id}`);
}))

router.delete('/:id', asyncCatcher(async (req, res) => {
    const {id} = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    res.redirect('/home') ;
}))

module.exports = router;
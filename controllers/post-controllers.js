const Post = require('../models/post');
const User = require('../models/user');
module.exports.index = async (req, res) => {
    const posts = await Post.find({}).populate('author');
    res.render('posts/index.ejs', {posts})
}

module.exports.renderNewPostForm = (req, res) => {
    res.render('posts/new.ejs')
}

module.exports.createNewPost = async (req, res) => {

    const date = new Date();
    const newPost = new Post({
        ...req.body.post,
        date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    });
    newPost.author = req.user._id;
    const user = await User.findById(req.user._id);
    user.posts.push(newPost);
    await user.save();
    await newPost.save();
    res.redirect('/home');
}

module.exports.showPost = async (req, res) => {
    const findPost = await Post.findById(req.params.id).populate('author');
    if (!findPost) {
        req.flash('error', 'Post does not exist.');
        return res.redirect('/home')
    }
    res.render('posts/show.ejs', {post: findPost});
}

module.exports.renderEditPostForm = async (req, res) => {
    const findPost = await Post.findById(req.params.id);
    if (!findPost) {
        req.flash('error', 'Post does not exist.');
        return res.redirect('/home')
    }
    res.render('posts/edit.ejs', {post: findPost})
}

module.exports.updatePost = async (req, res) => {
    const date = new Date();
    const {id} = req.params;
    const updatedPost = await Post.findByIdAndUpdate(id, {
        ...req.body.post,
        date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    })
    res.redirect(`/home/${updatedPost._id}`);
}

module.exports.deletePost = async (req, res) => {
    const {id} = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    const user = await User.findByIdAndUpdate(req.user._id, {$pull: {posts: id}});
    res.redirect('/home') ;
}
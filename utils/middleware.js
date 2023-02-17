const ExpressError = require('./express-error');
const asyncCatcher = require('./async-catcher');
const Post = require('../models/post');
const User = require('../models/user');
const {campgroundJoiSchema} = require('./joi-schemas');

module.exports.ensureLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in to perform this action!');
        return res.redirect('/login');
    }
    next();
}



module.exports.ensureNotAlreadyLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash('error', 'You are already logged in.');
        return res.redirect('/home');
    } else next();
}

module.exports.ensureNotAlreadyLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You are already logged out.');
        return res.redirect('/home');
    } else next();
}

module.exports.isAuthor = asyncCatcher(async (req, res, next) => {
    const {id} = req.params;
    const findPost = await Post.findById(id);
    if (!findPost.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to do that action!');
        return res.redirect(`/home/${findPost._id}`);
    }
    next();
})

module.exports.isCorrectUser = asyncCatcher(async (req, res, next) => {
    const {id} = req.params;
    const findUser = await User.findById(id);
    if (!findUser.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to do that action!');
        return res.redirect(`/user/${findUser._id}`);
    }
    next();
})

module.exports.validatePost = (req, res, next) => {

    const {error}  = campgroundJoiSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(el => el.message).join(','), 400);
    } else next();
}
const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const asyncCatcher = require('../utils/async-catcher');
const {ensureNotAlreadyLoggedIn, ensureNotAlreadyLoggedOut} = require('../utils/middleware');

router.get('/', (req, res) => {
    res.redirect('/home')
});

router.get('/register', ensureNotAlreadyLoggedIn, (req, res) => {
    res.render('users/register.ejs')
});

router.post('/register', ensureNotAlreadyLoggedIn, asyncCatcher(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Successfully registered!');
            return res.redirect('/home');
        });
    } catch (error) {
        req.flash('error', error.message)
        return res.redirect('/register');
    }
}))

router.get('/login', ensureNotAlreadyLoggedIn, (req, res) => {
    res.render('users/login.ejs');
})

router.post('/login', ensureNotAlreadyLoggedIn, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', `Welcome back, ${req.user.username}!`);
    res.redirect('/home');
});

router.get('/logout', ensureNotAlreadyLoggedOut, (req, res) => {
    req.logout(function (e) {
        if (e) return next(e);
        req.flash('success', 'Successfully logged out!')
        res.redirect('/home');
    });
})



module.exports = router;
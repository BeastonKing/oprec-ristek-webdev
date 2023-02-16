const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const asyncCatcher = require('../utils/async-catcher');
const {ensureNotAlreadyLoggedIn, ensureNotAlreadyLoggedOut} = require('../utils/middleware');
const userControllers = require('../controllers/user-controllers');

router.get('/', (req, res) => {
    res.redirect('/home')
});

router.route('/register')
    // Render registration form
    .get(ensureNotAlreadyLoggedIn, userControllers.renderRegisterForm)

    // Register
    .post(ensureNotAlreadyLoggedIn, asyncCatcher(userControllers.register))


router.route('/login')
    // Render login form
    .get(ensureNotAlreadyLoggedIn, userControllers.renderLoginForm)
    
    // Login
    .post(ensureNotAlreadyLoggedIn, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userControllers.login);

// Logout
router.get('/logout', ensureNotAlreadyLoggedOut, userControllers.logout);



module.exports = router;
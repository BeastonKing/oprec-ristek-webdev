const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const asyncCatcher = require('../utils/async-catcher');
const {ensureNotAlreadyLoggedIn, ensureNotAlreadyLoggedOut, ensureLoggedIn, isCorrectUser} = require('../utils/middleware');
const userControllers = require('../controllers/user-controllers');

const {storage} = require('../cloudinary/cloudinary-index');
const multer = require('multer');
const upload = multer({storage});
// const upload = multer({dest: 'uploads/'});

router.get('/', (req, res) => {
    res.redirect('/home')
});

router.route('/register')
    // Render registration form
    .get(ensureNotAlreadyLoggedIn, userControllers.renderRegisterForm)

    // Register
    .post(ensureNotAlreadyLoggedIn, upload.single('image'), asyncCatcher(userControllers.register))


router.route('/login')
    // Render login form
    .get(ensureNotAlreadyLoggedIn, userControllers.renderLoginForm)
    
    // Login
    .post(ensureNotAlreadyLoggedIn, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userControllers.login);

// Logout
router.get('/logout', ensureNotAlreadyLoggedOut, userControllers.logout);

router.route('/user/:id')
    // Profile Page
    .get(asyncCatcher(userControllers.renderProfilePage))

    // PUT Edit Profile
    .put(ensureLoggedIn, isCorrectUser, upload.single('image'), asyncCatcher(userControllers.editProfile))



// GET Edit Profile Page
router.get('/user/:id/edit',ensureLoggedIn, isCorrectUser, asyncCatcher(userControllers.renderEditProfileForm));


module.exports = router;
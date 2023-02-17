const express = require('express');
const router = express.Router();
const asyncCatcher = require('../utils/async-catcher');
const ExpressError = require('../utils/express-error');
const Post = require('../models/post');
const { ensureLoggedIn, isAuthor, validatePost } = require('../utils/middleware');
const postControllers = require('../controllers/post-controllers');

router.route('/')
    // GET All posts (Index)
    .get(asyncCatcher(postControllers.index))

    // POST New post
    .post(ensureLoggedIn, validatePost, asyncCatcher(postControllers.createNewPost))


// Render new post form
// This is unused, but does the exact same thing as form at /
router.get('/new', ensureLoggedIn, postControllers.renderNewPostForm);

router.route('/:id')
    // GET Post show page
    .get(asyncCatcher(postControllers.showPost))

    // PUT Updated post
    .put(ensureLoggedIn, isAuthor, validatePost, asyncCatcher(postControllers.updatePost))

    // DELETE post
    .delete(ensureLoggedIn, isAuthor, asyncCatcher(postControllers.deletePost))



// Render post edit form
router.get('/:id/edit', ensureLoggedIn, isAuthor, asyncCatcher(postControllers.renderEditPostForm));



module.exports = router;
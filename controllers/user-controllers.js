const User = require('../models/user');
const {cloudinary} = require('../cloudinary/cloudinary-index');
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register.ejs')
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        if (req.file) {
            user.image.url = req.file.path;
            user.image.filename = req.file.filename;
        } else {
            user.image.url = 'https://res.cloudinary.com/dfq6satrv/image/upload/v1676697841/ProfilePics/default-avatar_urbjpd.png'
            user.image.filename = 'ProfilePics/default-avatar_urbjpd'
        }
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login = (req, res) => {
    req.flash('success', `Welcome back, ${req.user.username}!`);
    res.redirect('/home');
}

module.exports.logout = (req, res) => {
    req.logout(function (e) {
        if (e) return next(e);
        req.flash('success', 'Successfully logged out!')
        res.redirect('/home');
    });
}

module.exports.renderProfilePage = async (req, res) => {
    const user = await User.findById(req.params.id).populate('posts');
    if (!user) {
        req.flash('error', 'User does not exist.');
        return res.redirect('/home')
    }
    res.render('users/profile.ejs', {user});
}

module.exports.renderEditProfileForm = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        req.flash('error', 'User does not exist.');
        return res.redirect('/home')
    }
    res.render('users/edit-profile.ejs', {user});
}

module.exports.editProfile = async (req, res) => {
    const {id} = req.params;
    const {bio} = req.body;
    const user = await User.findById(id);
    if (!user) {
        req.flash('error', 'User does not exist.');
        return res.redirect('/home')
    }
    if (req.file) {
        if (user.image.filename !== 'ProfilePics/default-avatar_urbjpd') {
            await cloudinary.uploader.destroy(user.image.filename);
        }
        user.image.url = req.file.path;
        user.image.filename = req.file.filename;
    }
    user.bio = bio;
    await user.save();
    req.flash('success', 'Profile has been successfully updated!')
    res.redirect(`/user/${user._id}`);
    
}
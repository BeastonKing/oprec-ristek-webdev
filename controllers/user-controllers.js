const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register.ejs')
}

module.exports.register = async (req, res) => {
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
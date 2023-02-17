const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        }
    ]
});

// Adds passport plugin to UserSchema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
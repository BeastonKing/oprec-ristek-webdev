const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    body: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Post', PostSchema);
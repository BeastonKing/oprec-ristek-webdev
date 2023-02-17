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
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

// PostSchema.post('findOneAndDelete', async function (doc) {

// })

module.exports = mongoose.model('Post', PostSchema);
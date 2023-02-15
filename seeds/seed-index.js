
const mongoose = require('mongoose');
const databaseUrl = process.env.MONGO_ATLAS_URL || 'mongodb://127.0.0.1:27017/ristek-medsos';
const Post = require('../models/post');


// Mongoose
mongoose.set('strictQuery', false);
mongoose.connect(databaseUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error:"));
db.once('open', () => {
    console.log("Mongo database connected");
});

const string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id dui sollicitudin, dapibus nisi eget, aliquam ligula. Sed dictum tellus mauris, in ultricies ex fermentum nec. Quisque semper et metus vitae mattis. Donec ex est, posuere vel neque ac, feugiat faucibus felis. Etiam sed lacus quis tellus imperdiet fermentum. Sed semper ullamcorper dolor, vitae scelerisque nisl vestibulum ac. Praesent vel efficitur urna. Nulla ac lorem tristique, ornare augue in, viverra nibh. Fusce ac interdum nulla, a auctor sapien. Orci varius natoque penatibus et magnis dis parturient montes'

// console.log(string.slice(0, 7))

const seedDB = async() => {
    await Post.deleteMany({});
    for (let i = 0; i < 8; i++) {
        const rand = Math.floor(Math.random() * string.length);
        const date = new Date();
        const newPost = new Post({
            body: `${string.slice(0, rand - 1)}`, 
            date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        });
        await newPost.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
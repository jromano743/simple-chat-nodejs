const mongoose = require('mongoose');
const { Schema } = mongoose;

//schema for mongodb database
const ChatSchema = new Schema({
    nick: String,
    message: String,
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Chat', ChatSchema);
const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

    score:{
        type: Number,
        default: 0
    },
    category:{
        type: String,
        default: 'General',
        enum: ['General', 'Social Discourse','How To', 'Web Design', 'Food Reviews', 'Movie Reviews']
    },

})

module.exports = mongoose.model('Post', PostSchema)
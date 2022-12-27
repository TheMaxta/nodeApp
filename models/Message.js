const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    new: {
        type: Boolean,
        required: true,
        default: true
      },
    subject: {
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Message', MessageSchema)
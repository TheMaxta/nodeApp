const res = require("express/lib/response")

const express = require("express")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Post = require("../models/Post.js")
const Message = require("../models/Message.js")
const User = require("../models/User.js")
const nodemon = require("nodemon")
const { render } = require("express/lib/response")
const { find } = require("../models/Post.js")


router.get('/', ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id }).lean()
        const oldestPost = posts[0]
        const newestPost = posts[posts.length-1]
        let highestPost = posts[0];
        let lowestPost = posts[0];
        let totalNumPosts = posts.length;


        posts.forEach(function (currentPost, index, arr) {
            if (currentPost.score > highestPost.score){ highestPost = currentPost }
        });
        posts.forEach(function (currentPost){
            if (currentPost.score < lowestPost.score){ lowestPost = currentPost }
        });


        res.render('profilePage', {
            layout: 'other',
            name: req.user.firstName,
            lastName: req.user.lastName,
            createdAt: req.user.createdAt,
            image: req.user.image,
            posts,
            oldestPost,
            newestPost,
            highestPost,
            lowestPost,
            totalNumPosts
            
        })    
    } catch (err) {
        console.error(err)
        res.render('error/500')        
    }
})


// @desc      Test page
// @route     GET /test
//create a route
router.get('/test', ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()

        res.render('welcome', {
            layout: 'other',
            name: req.user.firstName,
            lastName: req.user.lastName,
            image: req.user.image,
            posts
        })    
    } catch (err) {
        console.error(err)
        res.render('error/500')        
    }
})


router.get('/messages', ensureAuth, async (req, res) => {
    try {

        const posts = await Post.find({ user: req.user.id }).lean()
        const myInbox = await Message.find({ receiver: req.user}).lean()
        const inboxType = true


        //testing remove later
        //console.log(myInbox)


        res.render('messagesPage', {
            layout: 'other',
            name: req.user.firstName,
            lastName: req.user.lastName,
            image: req.user.image,
            myInbox,
            inboxType        
        })    
    } catch (err) {
        console.error(err)
        res.render('error/500')        
    }
})

router.get('/messages/sent', ensureAuth, async (req, res) => {
    try {

//        const posts = await Post.find({ user: req.user.id }).lean()
        const myInbox = await Message.find({ sender: req.user}).lean()
        const inboxType = false

        //testing remove later
        //console.log(myInbox)


        res.render('messagesPage', {
            layout: 'other',
            name: req.user.firstName,
            lastName: req.user.lastName,
            image: req.user.image,
            myInbox,
            inboxType          
        })    
    } catch (err) {
        console.error(err)
        res.render('error/500')        
    }
})

//user params to receiver id for individual message. Send individual message id through html link
router.get('/messages/view/:id', ensureAuth, async (req, res) => {
    try {
        const message = await Message.findOne({
            _id: req.params.id
        }).lean()


        //okay, so i want to update an attribute in the message model. New should be set to false when a message is opened,,,
        //I believe i may need to make a post or a put request,
        // I should be able to route this request through this current function by simply calling another fucntion inside of this one

        //message.new = false

        const myInbox = await Message.find({ sender: req.user}).lean()

        //testing remove later
        //console.log(myInbox)
        

        res.render('viewMessage', {
            name: req.user.firstName,
            lastName: req.user.lastName,
            image: req.user.image,
            message

        })    
    } catch (err) {
        console.error(err)
        res.render('error/500')        
    }
})



router.get('/messages/add_message', ensureAuth, async (req, res) => {
    req.body.user = req.user.id
    const current_user = req.user

    const users = await User.find().lean()
    console.log(req.user.firstName)
    res.render('posts/add_message',{
        users,
        name: req.user.firstName,
        current_user
    })

})


// @desc       Process add Message Form
// @route       POST /
router.post('/messages/add_message', ensureAuth, async (req, res) => {
    try {

        req.body.user = req.user.id

        //await Message.create(req.body)

        req.body.sender = req.user.id

        const user = req.user

        //need to match receiver's name returned by post.body to the user object of the recipient
        req.body.receiver = await User.findOne({ firstName: req.body.receiver })
        req.body.sender = await User.findOne({ firstName: user.firstName })

        console.log("\nTest message req.body: ")
        console.log(req.body)


        //req.body.receiver = await User.find( firstName: receiverName)
        //req.body.sender = req.body.user

        const message = new Message(req.body);
        await message.save()

        res.redirect('/')

    } catch(err) {
        console.error(err)
        res.render('error/500')
    }
})




module.exports = router
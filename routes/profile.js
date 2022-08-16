const res = require("express/lib/response")

const express = require("express")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Story = require("../models/User.js")
const nodemon = require("nodemon")


router.get('/', ensureAuth, async (req, res) => {
    try {
        res.render('profilePage', {
            layout: 'other',
            name: req.user.firstName,
            lastName: req.user.lastName,
            createdAt: req.user.createdAt,
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
        const stories = await Story.find({ user: req.user.id })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()

        res.render('welcome', {
            layout: 'other',
            name: req.user.firstName,
            lastName: req.user.lastName,
            image: req.user.image,
            stories
        })    
    } catch (err) {
        console.error(err)
        res.render('error/500')        
    }
})





module.exports = router
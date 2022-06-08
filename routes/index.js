const res = require("express/lib/response")

const express = require("express")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Story = require("../models/Story.js")
const nodemon = require("nodemon")

// @desc      Login/Landing page
// @route     GET /
//create a route
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })  
})

// @desc      Dashboard page
// @route     GET /dashboard
//create a route
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean().sort({ createdAt: 'desc' })


        res.render('dashboard', {
            name: req.user.firstName,
            lastName: req.user.lastName,
            stories
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

        res.render('../template/index', {
            layout: 'other',
            name: req.user.firstName,
            lastName: req.user.lastName,
            stories            
        })    
    } catch (err) {
        console.error(err)
        res.render('error/500')        
    }

     
})


module.exports = router
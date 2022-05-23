const res = require("express/lib/response")

const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story.js")


// @desc      Show Add page
// @route     GET /stories/add
//create a route
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add', {
    })
     
})


// @desc      Process add Form
// @route     POST /stories
//create a route
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('/error/500')
    }
     
})


// @desc      Show All Stories 
// @route     GET /stories/add
//create a route
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })

            .populate('user')
            .sort({createdAt: 'desc' })
            .lean()

            res.render('stories/index', {
                stories
            })
    } catch (err) {
        console.error(err)
        res.render('/error/500')
    }
     
})

module.exports = router  
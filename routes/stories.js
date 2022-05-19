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

module.exports = router  
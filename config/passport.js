//known issues: NONE, I'M PERFECT!
//jk, there is an OAuth client error that occurs when a change is made to the source code. Could potentially be a credential issue.
//Could involve mongoose. Looking into setting up a proper express mongoose app and double checking may solve. (long way to accomplish)
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User.js')

module.exports = function(passport) {
    passport.use( new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async(accessToken, refreshToken, profile, done) => {
//        console.log(profile)
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }
        try {
            //query db to check if user already exists
            let user = await User.findOne({ googleId: profile.id })

            if (user){
                done(null, user)
            } else {
                user = await User.create(newUser)
                done(null, user)
            }
        } catch (err) {
            console.error(err)
        }
    }))
    
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  })

}

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
require('dotenv').config();

const User = mongoose.model('User', new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value
      }).save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));
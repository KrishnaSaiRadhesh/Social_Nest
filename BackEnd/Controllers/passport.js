const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../Models/Auth");
const dotenv = require("dotenv");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/api/auth/google/callback"
          : "https://social-nest-2.onrender.com/api/auth/google/callback",
      passReqToCallback: true, // Add this to access req object
      proxy: true 
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google OAuth - Profile Email:", profile.emails[0].value);
        
        // Better image URL handling
        const googleImage = profile.photos[0]?.value;
        const sanitizedImageUrl = googleImage 
          ? googleImage.replace(/=s96-c$/, '=s400-c') // Higher resolution
          : './Profile.png';
        
        console.log("Processed Image URL:", sanitizedImageUrl);

        // Find by googleId first, then by email
        let user = await UserModel.findOne({ 
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        });

        if (!user) {
          // New user creation
          user = await UserModel.create({
            email: profile.emails[0].value,
            name: profile.displayName,
            image: sanitizedImageUrl,
            googleId: profile.id,
            googleImage: sanitizedImageUrl,
            verified: true
          });
          console.log("New Google user created:", user._id);
        } else {
          // Existing user update
          const updates = {
            name: profile.displayName || user.name,
            googleId: profile.id // Ensure googleId is set
          };

          // Only update image if we have a new Google image
          if (googleImage) {
            updates.image = sanitizedImageUrl;
            updates.googleImage = sanitizedImageUrl;
          }

          // Check if user previously used local auth
          if (!user.googleId && profile.id) {
            updates.googleId = profile.id;
            if (googleImage) {
              updates.image = sanitizedImageUrl;
              updates.googleImage = sanitizedImageUrl;
            }
          }

          user = await UserModel.findByIdAndUpdate(
            user._id,
            { $set: updates },
            { new: true }
          );
          console.log("Existing user updated:", user._id);
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error:", error);
        return done(error, null);
      }
    }
  )
);

// Serialization/Deserialization should be in your main server file
// but ensure it's properly set up there

module.exports = passport;
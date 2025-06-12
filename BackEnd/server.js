const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./Config/db");
const authRouter = require("./Routes/AuthRouter");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const fileUpload = require("express-fileupload");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const User = require("./Models/Auth");

dotenv.config();
const app = express();

app.use(fileUpload()); // ⬅️ This enables req.files
app.use(express.json()); // For JSON
app.use(express.urlencoded({ extended: true }));

// Passport configuration
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://social-nest-2.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await new User({
            googleId: profile.id,
            name: profile.displayName || profile.emails[0].value.split("@")[0], // Use displayName or fallback
            email: profile.emails[0].value,
            googleImage: profile.photos[0]?.value, // Save Google profile image
          }).save();
        } else {
          // Update existing user with latest Google data
          user.name = profile.displayName || user.name;
          user.googleImage = profile.photos[0]?.value || user.googleImage;
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

const allowedOrigins = [
  "http://localhost:5173",
  "https://funny-pony-68b842.netlify.app",
  "https://social-nest-six.vercel.app",
];

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Configure express-session for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
app.use(cors(corsOptions));

// Google Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("https://social-nest-six.vercel.app/home");
  }
);

app.get("/api/user", async (req, res) => {
  if (req.user) {
    // Fetch user from DB to ensure latest data
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Construct response with Google data if applicable
    res.json({
      _id: user._id,
      googleId: user.googleId,
      name: user.name,
      email: user.email,
      image: user.googleId ? user.googleImage : user.image, // Use googleImage for Google users
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("https://social-nest-six.vercel.app/login");
  });
});

// Existing Routes
app.use("/api/auth", authRouter);
app.use("/api/user", require("./Routes/UserRoute"));
app.use("/api/posts", require("./Routes/PostRouter"));
app.use("/api/messages", require("./Routes/MessageRouter"));
app.use("/api/stories", require("./Routes/StoryRouter")(io));

// Socket.IO
let onlineUsers = [];
const userSocketMap = new Map(); // Map socket.id to userId

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    userSocketMap.set(socket.id, userId);
    if (!onlineUsers.includes(userId)) {
      onlineUsers.push(userId);
    }
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", ({ roomId, ...message }) => {
    io.to(roomId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    const userId = userSocketMap.get(socket.id);
    if (userId) {
      onlineUsers = onlineUsers.filter((id) => id !== userId);
      userSocketMap.delete(socket.id);
      io.emit("onlineUsers", onlineUsers);
    }
  });
});

const Port = process.env.PORT || 3000;

server.listen(Port, () => {
  connectDB();
  console.log(`Server is running on port ${Port}`);
});

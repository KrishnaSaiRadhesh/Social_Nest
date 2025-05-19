const userModel = require("../Models/Auth")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { useTransition } = require("react")


exports.SIGNUP = async (req, res) => {
    const {name, email, password} = req.body

    try {
        if(!name || !email || !password){
            return res 
                .status(401)
                .json({message: "Please fill all the fields. ", success: false})
        }

        const existingemail = await userModel.findOne({email});
        if(existingemail){
            return res
                .status(401)
                .json({message: "user already exists with this email",
                success: false,
            });
                
        }

        const existingUser = await userModel.findOne({name});
        if(existingUser){
            return res
                .status(400).json({error: "Username already exists"});
        }

        
        if(password.length<6){
            return res.status(400).json({error: "Password must be at least 6 characters long"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            name,
            email, 
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User created successfully",
            success: true,
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Signup error"})
    }
}


exports.LOGIN = async(req, res) =>{
    const {email, password} = req.body

    try {
        if(!email || !password){
            return res.status(400).json({message: "All fields are required ", success:false})
        }

        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message: "Invalid email or password", success:false})
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            return res.status(400).json({message: "Invaild crrdentials", success:false})
        }


        
        const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "10d"})  // Here 

        const UserData = {
            _id: user._id,
            name: user.name,
            email: user.email
        }

        return res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days in ms

        }).json({
            message: `WELCOME back ${UserData.name}`,
            success: true,
            user: UserData
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Signup error"})
    }
    
}


exports.LOGOUT = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    return res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Logout error" });
  }
};


exports.GETALLUSER = async (req, res) => {
    try {
        const currentUserId = req.user._id; // Assuming you have added authentication middleware that sets req.user
        const allUsers = await userModel
            .find({ _id: { $ne: currentUserId } }) // exclude current user
            .select("-password");
        
        return res.status(200).json(allUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Fetch error" });
    }
}


exports.USERSTHATFOLLOW = async (req,res) => {
   try {
      const user_id = req.user._id;
      const users = await userModel.find({followers:user_id})
      console.log("friends",users)
      return res.status(200).json(users)
   } catch (error) {
      console.log(error)
      return res.status(400).json({message: "unable to fetch"})
   }
} 

exports.SUGGESTEDUSERS = async(req, res) =>{
    try {
        const user_id = req.user._id;
       const users = await userModel.find({ followers: { $ne: user_id } })
       
         return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: "unable to fetch"})
    }
}


exports.GETPROFILE = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("-password") // Exclude password
      .populate("following", "name image") // Populate following users
      .populate("followers", "name image") // Populate followers
      .populate("savedPosts", "description image mediaType user"); // Populate saved posts
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile." });
  }
};
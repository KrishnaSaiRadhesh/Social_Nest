// const userModel = require("../Models/Auth")
// const cloudinary = require("../Config/cloudinary")

// exports.UPDATEPROFILE = async (req, res) => {
//     const {name, email, image} = req.body;

//     try {
//         const user_id = req.user_id  // Here we are getting id from middleware which stored in cookies
//         const user = await userModel.findById(user_id) // Here we are checking whether the id is present in database.
//         if (!user) {
//             return res.status(404).json({message: "User not found"})
//         }
//         if(image){
//             if(user.image){
//                 await cloudinary.uploader.destory(user.image.split("/").pop.split(".")[0])
//             }
//             const uploadProfile_image = await cloudinary.uploader.upload(image);
//             image = uploadProfile_image.secureurl  
//         }

//        user.name = name || user.name
//        user.email = email || user.email
//        user.image = image || user.image
//        await user.save()

//        const updatedUser = await userModel.findByIdAndUpdate(req.user_id, {new:true})
//        res.status(200).json({message: "Profile updated successfully", updatedUser})

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({message: "Something went wrong"})
//     }
// }

const userModel = require('../Models/Auth');
const cloudinary = require('../Config/cloudinary');

exports.UPDATEPROFILE = async (req, res) => {
  const { name, email, image } = req.body;

  try {
    const user_id = req.user._id;
    const user = await userModel.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let updatedImageUrl = user.image || ''; // Default to empty string if no image

    if (image && image.startsWith('data:image')) {
      // Delete old image if it exists
      if (user.image) {
        try {
          const publicId = user.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (deleteError) {
          console.warn('Failed to delete old image:', deleteError.message);
          // Continue even if deletion fails
        }
      }

      // Upload new image
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: 'profile_images',
      });
      updatedImageUrl = uploadedImage.secure_url;
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.image = updatedImageUrl;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      updatedUser: user,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


exports.PROFILE = async(req, res) =>{
    try {
        const profile = await userModel.findById(req.user._id).populate("posts").select("-password")
        return res.status(200).json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Profile error"})
    }
}


exports.FOLLOW = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const userToFollowId = req.params.id;

    const userToFollow = await userModel.findById(userToFollowId);
    const currentUser = await userModel.findById(loggedInUserId) // Here when the user click on the follow button that specific id will go to that url and that id we will get using this params.id

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure followers is an array, default to [] if undefined
    const followers = userToFollow.followers || [];

    if (!followers.includes(loggedInUserId)) {
      await userToFollow.updateOne({ $push: { followers: loggedInUserId } });
      await currentUser.updateOne({ $push: { following: userToFollowId } });

      return res.status(200).json({ message: 'Followed successfully' });
    } else {
      return res.status(400).json({
        message: `You are already following ${userToFollow.name}`,
      });
    }
  } catch (error) {
    console.log('Error in FollowUser: ', error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.UNFOLLOW = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const userToFollowId = req.params.id;

    const userToFollow = await userModel.findById(userToFollowId);
    const currentUser = await userModel.findById(loggedInUserId);

    if(!userToFollow || !currentUser){
      return res.status(400).json({error: "User not found"});
    }

    if(userToFollow.followers.includes(loggedInUserId)){

      await userToFollow.updateOne({$pull: {followers: loggedInUserId}});
      await currentUser.updateOne({$pull: {following : userToFollowId}})

      return res.status(200).json({message: "Unfollowed successfully"})
    }
    else{
      return res.status(400).json({
        message: `You are not following ${userToFollow.name}`
      })
    }
  } catch (error) {
    console.log("Error in Unfollower: ", error.message);
    return res.status(500).json({error: error.message})
  }
}

exports.GET_USER_PROFILE = async (req, res) => {
  try {
    const userId = req.params.id;
 
    
    // Validate userId
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Ensure userId is a valid ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await userModel.findById(userId)
      .populate("posts")
      .select("-password");




    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};


// exports.USERSTHATFOLLOW = async (req,res) => {
//    try {
//       const user_id = req.user._id;
//       const users = await userModel.find({followers:user_id})
//       console.log("friends",users)
//       return res.status(200).json(users)
//    } catch (error) {
//       console.log(error)
//       return res.status(400).json({message: "unable to fetch"})
//    }
// } 
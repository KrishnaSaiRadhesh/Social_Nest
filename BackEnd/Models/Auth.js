const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    },
    image:{
        type:String,
        default:"/Profile.png"

    },
   followers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [], // Ensure default is an empty array
  },
  following: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [], // Ensure default is an empty array
  },
    posts:{
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        default: [],
    },
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] }], // New field for saved posts
}, 
{
    timestamps: true
}
)

module.exports = mongoose.model("User", userSchema)
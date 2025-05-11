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
    followers:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"User"
    },
    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    posts:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }
}, 
{
    timestamps: true
}
)

module.exports = mongoose.model("User", userSchema)
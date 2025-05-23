import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bycript from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
export const getUserProfile = async (req, res) => {
const userName = req.params.userName;
console.log("userName", userName);
try {
    const
    user =await User.findOne({name:userName});
    console.log("user", user);
    if(!user){
        return res.status(404).json({
            error: "User not found"
        });
    }
    res.status(200).json(user);
}catch(error){
    console.log("error in getUserProfile controller");
    return res.status(500).json({
        error: "Internal Server Error"
    });
}
}
export const followUser = async (req, res) => {
    try{
const {id}= req.params;
console.log("id", id);
const userToModify = await User.findById(id);
if(!userToModify){
    return res.status(404).json({
        error: "User not found"
    });
}
const user = await User.findById(req.user._id);
if(id==req.user._id.toString()){
    return res.status(400).json({
        error: "You cannot follow yourself"
    });
}
const isFollowing = user.followers.includes(user._id);
if(isFollowing){
    // Unfollow the user
    user.following = user.following.filter(userId => userId.toString() !== id);
    userToModify.followers = userToModify.followers.filter(userId => userId.toString() !== req.user._id);
    await user.save();
    await userToModify.save();
    return res.status(200).json({
        message: "Unfollowed successfully"
    });
}else{
    // Follow the user
    user.following.push(id);
    userToModify.followers.push(req.user._id);
    await user.save();
    await userToModify.save();

    const notification=new Notification({
      from: req.user._id,
      to: id,
      type: "follow"
    });
    await notification.save();
  //Todo return the notification to the user
    // Send notification to the user

    return res.status(200).json({
        message: "Followed successfully"

});
}
    }catch(error){
        console.log("error in followUser controller");
    return res.status(500).json({
        error: "Internal Server Error"
    });
    }
}
export const updateProfile = async (req, res) => {
    const {name,currentPassword,updatePassword,bio,email}=req.body;
    console.log("currentPassword", currentPassword);
    console.log("updatePassword", updatePassword);
    const{profilePicture}=req.body;
    const userId=req.user._id;

    try{
  let user= await User.findById(userId);
    if(!user){
        return res.status(404).json({
            error: "User not found"
        });
    }
    if((!currentPassword && updatePassword) || (currentPassword && !updatePassword)){
        return res.status(400).json({
            error: "Please provide both current and new password"
        });
    }
    if(currentPassword && updatePassword){
        const isMatch = await bycript.compare(currentPassword, user.password);
        if(!isMatch){
            return res.status(400).json({
                error: "Current password is incorrect"
            });
        }
        const salt = await bycript.genSalt(10);
        const hashedPassword = await bycript.hash(updatePassword, salt);
        user.password = hashedPassword;
    }
    if(profilePicture){
        if(user.profilePicture){
            const publicId = user.profilePicture.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
   // Upload new profile picture
   const uploadedResponse=await cloudinary.uploader.upload(profilePicture);
   profilePicture=uploadedResponse.secure_url;
 }

 user.name=name || user.name;
 user.bio=bio || user.bio;
 user.email=email || user.email;
 user.profilePicture=profilePicture || user.profilePicture;
 await user.save();
 console.log("updatedUser", user);
 res.status(200).json({
    message: "Profile updated successfully",user
 });

}catch(error){
        console.log("error in updateProfile controller");
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }

}

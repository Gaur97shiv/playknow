import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import {v2 as cloudinary} from "cloudinary";
import Notification from "../models/notification.model.js";
export const createPost= async (req, res) => {
    try{
        const {content} = req.body;
        let {image} = req.body;
        const userId=req.user._id.toString();
        console.log("userId",userId);
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({
                error: "User not found"
            });
        }
        if(!content && !image){
            return res.status(400).json({
                error: "Please provide content or image"
            });
        }
        if(image){
            uploadedResponse=await cloudinary.uploader.upload(image);
            image=uploadedResponse.secure_url;
            console.log("image",image);
        }
        const newPost=new Post({
            user: userId,
            content,
            image: image ? image.path : null
            
        })
        await newPost.save();
        return res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });
    }catch(err){
        console.error("Error in createPost controller:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}
export const deletePost= async (req, res) => {
    try{
        const {id} = req.params;
        const userId=req.user._id.toString();
        const post=await Post.findById(id);
        if(!post){
            return res.status(404).json({
                error: "Post not found"
            });
        }
        if(post.user.toString() !== userId){
            return res.status(403).json({
                error: "You are not authorized to delete this post"
            });
        }
        if(post.image){
            const imageId=post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imageId);
        }
        await Post.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Post deleted successfully"
        });
    }catch(err){
        console.error("Error in deletePost controller:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}
export const commentOnPost= async (req, res) => {
    try{
        const {id} = req.params;
        const {text} = req.body;
        const userId=req.user._id.toString();
        const post=await Post.findById(id);
        if(!post){
            return res.status(404).json({
                error: "Post not found"
            });
        }
        if(!text){
            return res.status(400).json({
                error: "Please provide a comment"
            });
        }
        post.comments.push({
            user: userId,
            text
        });
        await post.save();
        return res.status(200).json({
            message: "Comment added successfully",
            post
        });
    }catch(err){
        console.error("Error in commentOnPost controller:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}
export const likeOrUnlikePost= async (req, res) => {
    try{
        const {id} = req.params;
        const userId=req.user._id.toString();
        const post=await Post.findById(id);
        if(!post){
            return res.status(404).json({
                error: "Post not found"
            });
        }
        if(post.likes.includes(userId)){
            post.likes=post.likes.filter((like)=>like.toString() !== userId);
            await User.updateOne({_id:userId},{$pull:{likedPost:id}});
        }else{
            post.likes.push(userId);
            const likeNotification=new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });
            await likeNotification.save();
            await User.updateOne({_id:userId},{$push:{likedPost:id}});
        }
        await post.save();
        return res.status(200).json({
            message: "Post liked/unliked successfully",
            post
        });
    }catch(err){
        console.error("Error in likeOrUnlikePost controller:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}
export const getAllPosts= async (req, res) => {
    try{
        const userId=req.user._id.toString();
        const posts=await Post.find({}).populate({path:"user", select:"-password"}).populate({path:"comments.user" ,select:"-password"}).sort({createdAt: -1});
        return res.status(200).json({
            message: "Posts fetched successfully",
            posts
        });
    }catch(err){
        console.error("Error in getAllPosts controller:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}
export const getAllLikedPosts= async (req, res) => {
const userId=req.user._id;
try{
const user=await User.findById(userId);
if(!user){
    return res.status(404).json({
        error: "User not found"
    });

}
const likedPosts=await Post.find({_id: {$in: user.likedPost}}).populate({path:"user", select:"-password"}).populate({path:"comments.user" ,select:"-password"}).sort({createdAt: -1});
return res.status(200).json({
    message: "Liked posts fetched successfully",
    likedPosts
});

}catch(err){
    console.error("Error in getAllLikedPosts controller:", err);
    return res.status(500).json({
        error: "Internal Server Error"
    });
}
}
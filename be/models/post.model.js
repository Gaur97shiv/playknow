import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String,
    },
    content: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        text: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    }],
    total_coin_on_post: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Post = mongoose.model("Post", postSchema);
export default Post;
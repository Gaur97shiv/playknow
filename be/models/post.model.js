import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    score: {
        type: Number,
        default: 0
    },
    evaluated: {
        type: Boolean,
        default: false
    },
    isWinner: {
        type: Boolean,
        default: false
    },
    winnerReward: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

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
    comments: [commentSchema],
    total_coin_on_post: {
        type: Number,
        default: 0
    },
    post_pool_coins: {
        type: Number,
        default: 0
    },
    comment_pool_coins: {
        type: Number,
        default: 0
    },
    liker_reserve_coins: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    evaluated: {
        type: Boolean,
        default: false
    },
    evaluationDate: {
        type: Date
    },
    isWinner: {
        type: Boolean,
        default: false
    },
    winnerReward: {
        type: Number,
        default: 0
    },
    freezePeriod: {
        type: String
    }
}, { timestamps: true });

postSchema.index({ createdAt: -1 });
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ evaluated: 1, freezePeriod: 1 });
postSchema.index({ score: -1 });

const Post = mongoose.model("Post", postSchema);
export default Post;

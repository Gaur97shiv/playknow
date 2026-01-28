import mongoose from "mongoose";
import { REWARD_CONFIG } from "../config/rewardConfig.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        default: []
    },
    following: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        default: []
    },
    profilePicture: {
        type: String,
        default: "https://via.placeholder.com/150",
    },
    profileImg: {
        type: String,
        default: "",
    },
    coverImg: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: ""
    },
    likedPost:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: []
    }],
    balance: {
        type: Number,
        default: REWARD_CONFIG.INITIAL_BALANCE,
        min: 0
    },
    reputation: {
        type: Number,
        default: REWARD_CONFIG.INITIAL_REPUTATION,
        min: 0,
        max: 100
    },
    dailyPostCount: {
        type: Number,
        default: 0
    },
    dailyCommentCount: {
        type: Number,
        default: 0
    },
    dailyLikeCount: {
        type: Number,
        default: 0
    },
    lastDailyReset: {
        type: Date,
        default: Date.now
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    totalWins: {
        type: Number,
        default: 0
    },
    fraudFlags: [{
        type: String
    }],
    isSuspended: {
        type: Boolean,
        default: false
    },
    suspendedUntil: {
        type: Date
    },
    suspensionReason: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.index({ reputation: -1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);
export default User;

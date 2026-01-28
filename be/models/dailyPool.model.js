import mongoose from "mongoose";

const dailyPoolSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true
    },
    total_pool_coins: {
        type: Number,
        default: 0
    },
    platform_fee_coins: {
        type: Number,
        default: 0
    },
    liker_reserve_coins: {
        type: Number,
        default: 0
    },
    posts_count: {
        type: Number,
        default: 0
    },
    comments_count: {
        type: Number,
        default: 0
    },
    likes_count: {
        type: Number,
        default: 0
    },
    distributed: {
        type: Boolean,
        default: false
    },
    distributedAt: {
        type: Date
    },
    winnerPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    winnerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    winnerReward: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

dailyPoolSchema.index({ date: 1 });
dailyPoolSchema.index({ distributed: 1 });

const DailyPool = mongoose.model("DailyPool", dailyPoolSchema);
export default DailyPool;

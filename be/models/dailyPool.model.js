import mongoose from "mongoose";

const dailyPoolSchema = new mongoose.Schema({
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
        unique: true
    },
    total_pool_coins: {
        type: Number,
        default: 0
    },
    posts_count: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const DailyPool = mongoose.model("DailyPool", dailyPoolSchema);
export default DailyPool;

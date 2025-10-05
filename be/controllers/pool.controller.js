import DailyPool from "../models/dailyPool.model.js";
import { getTodayDateString } from "../lib/utils/balanceUtils.js";

export const getDailyPool = async (req, res) => {
    try {
        const today = getTodayDateString();
        
        const dailyPool = await DailyPool.findOne({ date: today });
        
        if (!dailyPool) {
            return res.status(200).json({
                date: today,
                total_pool_coins: 0,
                posts_count: 0,
                message: "No activity for today yet"
            });
        }
        
        res.status(200).json(dailyPool);
    } catch (error) {
        console.log("Error in getDailyPool: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getAllDailyPools = async (req, res) => {
    try {
        const pools = await DailyPool.find()
            .sort({ date: -1 })
            .limit(30); // Get last 30 days
        
        res.status(200).json(pools);
    } catch (error) {
        console.log("Error in getAllDailyPools: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

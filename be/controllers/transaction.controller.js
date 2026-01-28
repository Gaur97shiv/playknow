import { getUserTransactions, getUserTransactionSummary } from "../lib/utils/transactionUtils.js";

export const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { limit = 50, offset = 0, type = null } = req.query;
        
        const result = await getUserTransactions(userId, {
            limit: parseInt(limit),
            offset: parseInt(offset),
            type
        });
        
        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }
        
        return res.status(200).json({
            transactions: result.transactions,
            total: result.total,
            hasMore: result.hasMore
        });
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getTransactionSummary = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const result = await getUserTransactionSummary(userId);
        
        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }
        
        return res.status(200).json(result.summary);
    } catch (error) {
        console.error("Error fetching transaction summary:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

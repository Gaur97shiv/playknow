import Transaction from "../../models/transaction.model.js";
import User from "../../models/user.model.js";

export const createTransaction = async ({
    userId,
    type,
    amount,
    direction,
    relatedPost = null,
    relatedComment = null,
    description = "",
    metadata = {}
}) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, error: "User not found" };
        }
        
        const transaction = new Transaction({
            user: userId,
            type,
            amount,
            direction,
            relatedPost,
            relatedComment,
            description,
            balanceAfter: user.balance,
            metadata
        });
        
        await transaction.save();
        return { success: true, transaction };
    } catch (error) {
        console.error("Error creating transaction:", error);
        return { success: false, error: "Database error" };
    }
};

export const getUserTransactions = async (userId, options = {}) => {
    try {
        const { limit = 50, offset = 0, type = null } = options;
        
        const query = { user: userId };
        if (type) {
            query.type = type;
        }
        
        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .populate("relatedPost", "content image")
            .lean();
        
        const total = await Transaction.countDocuments(query);
        
        return {
            success: true,
            transactions,
            total,
            hasMore: offset + transactions.length < total
        };
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return { success: false, error: "Database error" };
    }
};

export const getUserTransactionSummary = async (userId) => {
    try {
        const [creditResult, debitResult] = await Promise.all([
            Transaction.aggregate([
                { $match: { user: userId, direction: "credit" } },
                { $group: { _id: "$type", total: { $sum: "$amount" } } }
            ]),
            Transaction.aggregate([
                { $match: { user: userId, direction: "debit" } },
                { $group: { _id: "$type", total: { $sum: "$amount" } } }
            ])
        ]);
        
        const summary = {
            credits: {},
            debits: {},
            totalCredits: 0,
            totalDebits: 0
        };
        
        creditResult.forEach(item => {
            summary.credits[item._id] = item.total;
            summary.totalCredits += item.total;
        });
        
        debitResult.forEach(item => {
            summary.debits[item._id] = item.total;
            summary.totalDebits += item.total;
        });
        
        return { success: true, summary };
    } catch (error) {
        console.error("Error fetching transaction summary:", error);
        return { success: false, error: "Database error" };
    }
};

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["post", "comment", "like", "reward", "refund", "penalty", "signup_bonus"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    direction: {
        type: String,
        enum: ["debit", "credit"],
        required: true
    },
    relatedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    relatedComment: {
        type: String
    },
    description: {
        type: String
    },
    balanceAfter: {
        type: Number
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ type: 1, createdAt: -1 });
transactionSchema.index({ relatedPost: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;

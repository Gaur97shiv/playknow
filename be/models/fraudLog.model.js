import mongoose from "mongoose";

const fraudLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["rapid_actions", "coordinated_likes", "multiple_accounts", "spam_content", "unusual_pattern", "bot_behavior"],
        required: true
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "low"
    },
    description: {
        type: String
    },
    evidence: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    relatedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    relatedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    resolved: {
        type: Boolean,
        default: false
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    resolvedAt: {
        type: Date
    },
    action: {
        type: String,
        enum: ["none", "warning", "reputation_penalty", "temporary_suspension", "permanent_ban"],
        default: "none"
    }
}, { timestamps: true });

fraudLogSchema.index({ user: 1, createdAt: -1 });
fraudLogSchema.index({ severity: 1, resolved: 1 });

const FraudLog = mongoose.model("FraudLog", fraudLogSchema);
export default FraudLog;

import mongoose from "mongoose";

const winnerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    commentId: {
        type: String
    },
    score: {
        type: Number,
        required: true
    },
    reward: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["post", "comment"],
        required: true
    }
});

const evaluationResultSchema = new mongoose.Schema({
    evaluationDate: {
        type: Date,
        required: true
    },
    freezePeriod: {
        type: String,
        required: true
    },
    totalPostsEvaluated: {
        type: Number,
        default: 0
    },
    totalCommentsEvaluated: {
        type: Number,
        default: 0
    },
    totalPoolDistributed: {
        type: Number,
        default: 0
    },
    totalLikerRewardsDistributed: {
        type: Number,
        default: 0
    },
    topPostWinner: winnerSchema,
    topCommentWinners: [winnerSchema],
    likerRewards: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        reward: Number,
        forPost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
        forComment: String
    }],
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed", "failed"],
        default: "pending"
    },
    errorMessage: {
        type: String
    }
}, { timestamps: true });

evaluationResultSchema.index({ evaluationDate: -1 });
evaluationResultSchema.index({ freezePeriod: 1 });

const EvaluationResult = mongoose.model("EvaluationResult", evaluationResultSchema);
export default EvaluationResult;

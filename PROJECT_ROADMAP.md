# PlayKnow - Complete Project Roadmap & Implementation Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Current State Analysis](#current-state-analysis)
3. [Architecture Overview](#architecture-overview)
4. [Implementation Phases](#implementation-phases)
5. [Technical Specifications](#technical-specifications)
6. [Anti-Fraud & AI Detection System](#anti-fraud--ai-detection-system)
7. [Narad AI Agent Implementation](#narad-ai-agent-implementation)
8. [Testing & Quality Assurance](#testing--quality-assurance)
9. [Deployment Strategy](#deployment-strategy)
10. [Future Enhancements](#future-enhancements)

---

## 🎯 Project Overview

### Vision
Build a reward-based social media platform (similar to X/Twitter) where users are incentivized with financial rewards for quality engagement. The platform uses a scoring algorithm based on likes, comments, and posts, with daily evaluation cycles and AI-powered fraud detection.

### Core Features
- **Posting System**: Users pay 20 coins to post
- **Commenting System**: Users pay 10 coins to comment
- **Liking System**: Users pay 1 coin to like
- **Daily Evaluation Cycle**: 
  - Active period: 8 AM - 6 AM (next day) = 22 hours
  - Freeze period: 6 AM - 8 AM = 2 hours (evaluation happens)
- **Reward Distribution**: Top posts/comments receive prize pool rewards
- **Liker Rewards**: Users who liked winning posts/comments get rewards
- **AI Fraud Detection**: Detect manipulation, fake accounts, coordinated activities
- **Narad AI Agent**: Analyze user behavior and content quality (future phase)

---

## 📊 Current State Analysis

### ✅ What's Already Implemented

#### Backend (Node.js + Express + MongoDB)
- ✅ User authentication (signup, login, JWT)
- ✅ User model with balance field (default 100 coins)
- ✅ Post model with likes, comments, images
- ✅ Daily pool model for tracking daily coin pools
- ✅ Notification system (follow, like)
- ✅ Balance utilities (check, deduct, add to pools)
- ✅ Post creation with fee deduction (20 coins)
- ✅ Comment creation with fee deduction (5 coins - **needs update to 10**)
- ✅ Like/unlike with fee deduction (2 coins - **needs update to 1**)
- ✅ Basic pool tracking system

#### Frontend (React + Vite + Tailwind)
- ✅ X/Twitter-like UI design
- ✅ Authentication pages (login, signup)
- ✅ Homepage with "For You" and "Following" feeds
- ✅ Post creation component
- ✅ Post display component
- ✅ Profile page
- ✅ Notification page
- ✅ Sidebar and RightPanel components
- ✅ React Query for data fetching
- ✅ Daily pool hook (useDailyPool)

### ❌ What's Missing

#### Critical Missing Features
1. **Daily Evaluation System**
   - Cron job for daily evaluation at 6 AM
   - Post scoring algorithm
   - Comment scoring algorithm
   - Winner selection logic
   - Reward distribution mechanism

2. **Enhanced Reward Model**
   - Fee splitting (Prize pool / Platform fee / Liker reserve)
   - Top post winner selection (80% of pool)
   - Top comment winner selection (80% of post pool)
   - Liker reward distribution (3 coins for winning posts, 2 for winning comments)

3. **Transaction System**
   - Transaction model for tracking all coin movements
   - Transaction history for users
   - Refund mechanism for deleted posts

4. **Time Window Management**
   - Restrict posting/commenting/liking during freeze period (6 AM - 8 AM)
   - Time-based validation in controllers

5. **Post Pool System**
   - Individual post pools (currently only daily pool exists)
   - Post pool distribution logic

6. **Reputation & Rate Limiting**
   - Account age tracking
   - Daily action limits per user
   - Reputation scoring system

7. **Anti-Fraud System**
   - Pattern detection for coordinated activities
   - Multiple account detection
   - Unusual behavior flags
   - AI-based anomaly detection

8. **Frontend Enhancements**
   - Balance display in UI
   - Transaction history page
   - Daily pool visualization
   - Winner announcements UI
   - Time remaining indicator for current cycle

---

## 🏗️ Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ HomePage │  │ Profile  │  │ Notifications│ Balance  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼──────────────┼─────────────┼─────────┘
        │             │              │             │
        └─────────────┴──────────────┴─────────────┘
                           │ REST API
        ┌──────────────────┴──────────────────┐
        │      BACKEND (Node.js + Express)     │
        │  ┌──────────┐  ┌──────────┐         │
        │  │  Routes  │→ │Controllers│         │
        │  └────┬─────┘  └────┬─────┘         │
        │       │             │                │
        │  ┌────┴─────────────┴────┐          │
        │  │   Business Logic      │          │
        │  │  - Balance Utils      │          │
        │  │  - Evaluation Engine  │          │
        │  │  - Fraud Detection    │          │
        │  └────────┬──────────────┘          │
        │           │                         │
        │  ┌────────┴─────────┐              │
        │  │  Cron Jobs       │              │
        │  │  (node-cron)     │              │
        │  └────────┬─────────┘              │
        └───────────┼────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │   DATABASE (MongoDB)   │
        │  ┌──────────────────┐  │
        │  │ Users            │  │
        │  │ Posts            │  │
        │  │ DailyPools       │  │
        │  │ Transactions     │  │
        │  │ FraudLogs        │  │
        │  └──────────────────┘  │
        └─────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │   AI SERVICES (Future) │
        │  ┌──────────────────┐  │
        │  │ Fraud Detection  │  │
        │  │ Content Analysis │  │
        │  │ Narad AI Agent   │  │
        │  └──────────────────┘  │
        └─────────────────────────┘
```

### Database Schema Extensions Needed

#### Transaction Model (New)
```javascript
{
  user: ObjectId,
  type: "post" | "comment" | "like" | "reward" | "refund",
  amount: Number,
  direction: "debit" | "credit",
  relatedPost: ObjectId (optional),
  relatedComment: ObjectId (optional),
  description: String,
  timestamp: Date
}
```

#### Post Model Extensions
```javascript
{
  // ... existing fields
  post_pool_coins: Number,        // NEW: Individual post pool
  comment_pool_coins: Number,     // NEW: Comment pool for this post
  score: Number,                   // NEW: Calculated score for evaluation
  evaluated: Boolean,              // NEW: Whether evaluated in current cycle
  evaluationDate: Date,            // NEW: Last evaluation date
  isWinner: Boolean,               // NEW: Won in last evaluation
  winnerReward: Number,            // NEW: Reward received
  freezePeriod: String             // NEW: Which freeze period this post belongs to
}
```

#### Comment Model Extensions (Subdocument in Post)
```javascript
{
  // ... existing fields
  score: Number,                   // NEW: Calculated comment score
  evaluated: Boolean,              // NEW: Whether evaluated
  isWinner: Boolean,               // NEW: Won in post's comment evaluation
  winnerReward: Number             // NEW: Reward received
}
```

#### User Model Extensions
```javascript
{
  // ... existing fields
  reputation: Number,              // NEW: Reputation score (0-100)
  accountAge: Date,                // NEW: Account creation date
  dailyPostCount: Number,          // NEW: Posts today (resets daily)
  dailyCommentCount: Number,       // NEW: Comments today
  dailyLikeCount: Number,          // NEW: Likes today
  lastResetDate: Date,             // NEW: Last reset date for daily counts
  fraudFlags: [String],            // NEW: Fraud detection flags
  isSuspended: Boolean,            // NEW: Suspension status
  totalEarnings: Number,           // NEW: Lifetime earnings
  totalSpent: Number               // NEW: Lifetime spending
}
```

---

## 🚀 Implementation Phases

## PHASE 1: Foundation & Core Reward System (Week 1-2)

### 1.1 Database Schema Updates

**Tasks:**
- [ ] Create Transaction model
- [ ] Extend Post model with evaluation fields
- [ ] Extend User model with reputation and daily limits
- [ ] Create migration script for existing data

**Files to Create/Modify:**
- `be/models/transaction.model.js` (NEW)
- `be/models/post.model.js` (UPDATE)
- `be/models/user.model.js` (UPDATE)
- `be/db/migrations/` (NEW directory)

**Implementation:**

```javascript
// be/models/transaction.model.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["post", "comment", "like", "reward", "refund", "penalty"],
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
        type: String // Store comment ID as string (nested in post)
    },
    description: {
        type: String
    },
    balanceAfter: {
        type: Number // User balance after this transaction
    }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
```

### 1.2 Update Fee Constants & Fee Splitting

**Tasks:**
- [ ] Update comment fee from 5 to 10 coins
- [ ] Update like fee from 2 to 1 coin
- [ ] Implement fee splitting logic
- [ ] Create configuration file for reward parameters

**Files to Create/Modify:**
- `be/config/rewardConfig.js` (NEW)
- `be/controllers/post.controller.js` (UPDATE)
- `be/lib/utils/balanceUtils.js` (UPDATE)

**Implementation:**

```javascript
// be/config/rewardConfig.js
export const REWARD_CONFIG = {
    // Fees
    POST_FEE: 20,
    COMMENT_FEE: 10,
    LIKE_FEE: 1,
    
    // Fee Distribution (percentages)
    FEE_SPLIT: {
        PRIZE_POOL: 80,      // 80% to prize pool
        PLATFORM_FEE: 15,    // 15% to platform
        LIKER_RESERVE: 5     // 5% to liker rewards
    },
    
    // Winner Rewards
    TOP_POST_REWARD_PERCENT: 80,      // Winner gets 80% of post pool
    TOP_COMMENT_REWARD_PERCENT: 80,   // Winner gets 80% of comment pool
    
    // Liker Rewards
    LIKER_REWARD_POST: 3,    // Coins for liking winning post
    LIKER_REWARD_COMMENT: 2, // Coins for liking winning comment
    
    // Daily Cycle
    ACTIVE_START_HOUR: 8,    // 8 AM
    FREEZE_START_HOUR: 6,    // 6 AM
    EVALUATION_DURATION_HOURS: 2,
    
    // Limits
    MAX_POSTS_PER_DAY: 10,
    MAX_COMMENTS_PER_DAY: 50,
    MAX_LIKES_PER_DAY: 100
};
```

### 1.3 Transaction System Implementation

**Tasks:**
- [ ] Create transaction utility functions
- [ ] Integrate transaction logging in all balance operations
- [ ] Update balanceUtils to log transactions

**Files to Create/Modify:**
- `be/lib/utils/transactionUtils.js` (NEW)
- `be/lib/utils/balanceUtils.js` (UPDATE)

### 1.4 Post Pool System Enhancement

**Tasks:**
- [ ] Extend Post model with post_pool_coins and comment_pool_coins
- [ ] Update addToPostPool to split fees correctly
- [ ] Track individual comment pools

**Files to Modify:**
- `be/models/post.model.js`
- `be/lib/utils/balanceUtils.js`
- `be/controllers/post.controller.js`

---

## PHASE 2: Daily Evaluation System (Week 2-3)

### 2.1 Scoring Algorithm

**Tasks:**
- [ ] Design and implement post scoring algorithm
- [ ] Design and implement comment scoring algorithm
- [ ] Create scoring utilities

**Scoring Formula:**

```
Post Score = (likes × 1) + (comments × 2) + (comment_likes × 0.5) + reputation_bonus

Where:
- reputation_bonus = user.reputation × 0.1
- Weighted by account age: score × (1 + accountAgeDays / 365 × 0.1)

Comment Score = (comment_likes × 1) + (replies × 2) + reputation_bonus
```

**Files to Create:**
- `be/lib/utils/scoringUtils.js` (NEW)

**Implementation:**

```javascript
// be/lib/utils/scoringUtils.js
import Post from "../../models/post.model.js";
import User from "../../models/user.model.js";

export const calculatePostScore = async (post) => {
    const postUser = await User.findById(post.user);
    const accountAgeDays = (new Date() - postUser.createdAt) / (1000 * 60 * 60 * 24);
    
    const likesCount = post.likes.length;
    const commentsCount = post.comments.length;
    
    // Calculate comment likes
    let commentLikesCount = 0;
    // Note: You may need to add likes to comments if not already implemented
    
    const reputationBonus = (postUser.reputation || 0) * 0.1;
    
    let baseScore = (likesCount * 1) + (commentsCount * 2) + (commentLikesCount * 0.5) + reputationBonus;
    
    // Account age multiplier (up to 10% boost for 1 year old accounts)
    const ageMultiplier = 1 + (Math.min(accountAgeDays / 365, 1) * 0.1);
    
    return baseScore * ageMultiplier;
};

export const calculateCommentScore = async (comment, postUser) => {
    const commentUser = await User.findById(comment.user);
    const accountAgeDays = (new Date() - commentUser.createdAt) / (1000 * 60 * 60 * 24);
    
    // If comments can have likes, count them here
    const likesCount = comment.likes ? comment.likes.length : 0;
    const repliesCount = comment.replies ? comment.replies.length : 0;
    const reputationBonus = (commentUser.reputation || 0) * 0.1;
    
    let baseScore = (likesCount * 1) + (repliesCount * 2) + reputationBonus;
    const ageMultiplier = 1 + (Math.min(accountAgeDays / 365, 1) * 0.1);
    
    return baseScore * ageMultiplier;
};
```

### 2.2 Cron Job Setup

**Tasks:**
- [ ] Install node-cron package
- [ ] Create evaluation job that runs at 6 AM daily
- [ ] Implement freeze period check
- [ ] Create evaluation controller

**Files to Create/Modify:**
- `be/jobs/evaluationJob.js` (NEW)
- `be/controllers/evaluation.controller.js` (NEW)
- `be/server.js` (UPDATE - add cron job)

**Implementation:**

```javascript
// be/jobs/evaluationJob.js
import cron from "node-cron";
import { runDailyEvaluation } from "../controllers/evaluation.controller.js";

// Run at 6 AM every day
export const startEvaluationJob = () => {
    cron.schedule("0 6 * * *", async () => {
        console.log("Starting daily evaluation at", new Date());
        try {
            await runDailyEvaluation();
            console.log("Daily evaluation completed successfully");
        } catch (error) {
            console.error("Error in daily evaluation:", error);
        }
    });
};
```

### 2.3 Evaluation Engine

**Tasks:**
- [ ] Get all posts from previous active period
- [ ] Calculate scores for all posts
- [ ] Select top post winner
- [ ] Calculate scores for comments on each post
- [ ] Select top comment winner for each post
- [ ] Distribute rewards
- [ ] Update post pools for next cycle

**Files to Create:**
- `be/controllers/evaluation.controller.js` (NEW)

**Implementation Steps:**

1. **Get Eligible Posts**: Posts created between 8 AM yesterday and 6 AM today
2. **Calculate Scores**: For each post and its comments
3. **Select Winners**: Top post and top comment per post
4. **Distribute Rewards**:
   - 80% of post pool to post winner
   - 20% stays in platform/reserve
   - 80% of comment pool to comment winner
   - Distribute liker rewards
5. **Reset for Next Cycle**: Mark posts as evaluated, reset pools

### 2.4 Time Window Validation

**Tasks:**
- [ ] Create utility to check if current time is in freeze period
- [ ] Add validation to post/comment/like controllers
- [ ] Return appropriate error messages

**Files to Create/Modify:**
- `be/lib/utils/timeUtils.js` (NEW)
- `be/controllers/post.controller.js` (UPDATE)

---

## PHASE 3: Frontend Enhancements (Week 3-4)

### 3.1 Balance & Transaction UI

**Tasks:**
- [ ] Display user balance prominently
- [ ] Create transaction history page
- [ ] Add balance updates on actions
- [ ] Show fee information before actions

**Files to Create/Modify:**
- `fe/vite-project/src/pages/balance/TransactionHistory.jsx` (NEW)
- `fe/vite-project/src/components/common/BalanceDisplay.jsx` (NEW)
- `fe/vite-project/src/App.jsx` (UPDATE - add route)

### 3.2 Daily Pool Visualization

**Tasks:**
- [ ] Show current daily pool amount
- [ ] Display time remaining in current cycle
- [ ] Show previous winners
- [ ] Add countdown timer

**Files to Create/Modify:**
- `fe/vite-project/src/components/common/DailyPoolCard.jsx` (NEW)
- `fe/vite-project/src/components/common/RightPanel.jsx` (UPDATE)

### 3.3 Winner Announcements

**Tasks:**
- [ ] Create winner announcement component
- [ ] Show recent winners in UI
- [ ] Add notifications for winners

**Files to Create:**
- `fe/vite-project/src/components/common/WinnerAnnouncement.jsx` (NEW)

### 3.4 Enhanced Post Display

**Tasks:**
- [ ] Show post pool amount on each post
- [ ] Display score if visible
- [ ] Show winner badge
- [ ] Display time until evaluation

**Files to Modify:**
- `fe/vite-project/src/components/common/Post.jsx`

---

## PHASE 4: Rate Limiting & Reputation System (Week 4-5)

### 4.1 Daily Limits Implementation

**Tasks:**
- [ ] Track daily action counts in User model
- [ ] Create middleware to check daily limits
- [ ] Reset daily counts at 8 AM
- [ ] Add limit indicators in UI

**Files to Create/Modify:**
- `be/middleware/dailyLimitCheck.js` (NEW)
- `be/controllers/post.controller.js` (UPDATE)
- `be/models/user.model.js` (UPDATE)

### 4.2 Reputation System

**Tasks:**
- [ ] Implement reputation calculation algorithm
- [ ] Update reputation on wins, losses
- [ ] Create reputation history
- [ ] Display reputation in profile

**Reputation Formula:**
```
Reputation = base_reputation + (wins × 5) - (violations × 10) + (account_age_bonus)

Where:
- base_reputation starts at 50
- wins increase reputation
- fraud flags decrease reputation
- Older accounts get bonus
```

**Files to Create:**
- `be/lib/utils/reputationUtils.js` (NEW)

### 4.3 Account Age Tracking

**Tasks:**
- [ ] Track account creation date
- [ ] Calculate account age
- [ ] Apply age-based bonuses in scoring
- [ ] Show account age in profile

---

## PHASE 5: Anti-Fraud & AI Detection System (Week 5-7)

### 5.1 Pattern Detection Engine

**Tasks:**
- [ ] Detect coordinated like patterns
- [ ] Identify multiple accounts from same IP
- [ ] Detect rapid-fire actions
- [ ] Flag suspicious comment patterns

**Detection Strategies:**

1. **Coordinated Activity Detection**
   - Same users interacting with same posts repeatedly
   - Unusual time clustering of interactions
   - Identical comment patterns

2. **Multiple Account Detection**
   - IP address tracking (optional, privacy-conscious)
   - Device fingerprinting (browser-based)
   - Behavioral similarity analysis

3. **Rapid Action Detection**
   - Too many likes in short time
   - Comments posted too quickly
   - Unrealistic engagement rates

**Files to Create:**
- `be/lib/utils/fraudDetection.js` (NEW)
- `be/models/fraudLog.model.js` (NEW)
- `be/controllers/fraud.controller.js` (NEW)

**Implementation:**

```javascript
// be/lib/utils/fraudDetection.js
import Post from "../../models/post.model.js";
import User from "../../models/user.model.js";
import Transaction from "../../models/transaction.model.js";

export const detectFraudPatterns = async (userId, actionType, relatedPostId) => {
    const flags = [];
    
    // Check 1: Rapid actions
    const recentActions = await Transaction.find({
        user: userId,
        createdAt: { $gte: new Date(Date.now() - 60 * 1000) } // Last minute
    });
    
    if (recentActions.length > 10) {
        flags.push("RAPID_ACTIONS");
    }
    
    // Check 2: Coordinated likes (same users liking same posts)
    if (actionType === "like" && relatedPostId) {
        const post = await Post.findById(relatedPostId);
        const recentLikers = post.likes.slice(-10); // Last 10 likers
        
        // Check if these users often interact together
        const interactionPattern = await checkUserInteractionPattern(recentLikers);
        if (interactionPattern.score > 0.8) {
            flags.push("COORDINATED_ACTIVITY");
        }
    }
    
    // Check 3: Same user commenting multiple times on same post
    if (actionType === "comment" && relatedPostId) {
        const post = await Post.findById(relatedPostId);
        const userCommentCount = post.comments.filter(
            c => c.user.toString() === userId.toString()
        ).length;
        
        if (userCommentCount > 3) {
            flags.push("EXCESSIVE_COMMENTS");
        }
    }
    
    return flags;
};

const checkUserInteractionPattern = async (userIds) => {
    // Analyze how often these users interact with same content
    // Returns a score 0-1 indicating likelihood of coordination
    // Implementation details...
};
```

### 5.2 AI-Powered Anomaly Detection

**Tasks:**
- [ ] Set up OpenAI/Claude API integration
- [ ] Create content analysis prompts
- [ ] Detect suspicious content patterns
- [ ] Flag manipulation attempts

**AI Detection Prompts:**

```javascript
// Example prompt for fraud detection
const fraudDetectionPrompt = `
Analyze the following user activity patterns and determine if there are signs of manipulation:

User Activity:
- Posts: ${userPosts.length}
- Comments: ${userComments.length}
- Likes given: ${userLikes.length}
- Interactions with same users: ${sameUserInteractions}%

Engagement Patterns:
${JSON.stringify(engagementPatterns)}

Determine:
1. Likelihood of coordinated activity (0-100)
2. Likelihood of multiple accounts (0-100)
3. Unusual patterns detected
4. Recommended action

Respond in JSON format.
`;
```

**Files to Create:**
- `be/lib/ai/fraudDetectionAI.js` (NEW)
- `be/config/aiConfig.js` (NEW)

### 5.3 Fraud Response System

**Tasks:**
- [ ] Create fraud flag system
- [ ] Implement automatic penalties
- [ ] Create admin review system
- [ ] Add suspension mechanism

**Actions on Fraud Detection:**

1. **Low Risk**: Flag and monitor
2. **Medium Risk**: Reduce reputation, limit actions
3. **High Risk**: Suspend account, freeze rewards
4. **Critical**: Permanent ban, forfeit rewards

**Files to Create:**
- `be/controllers/fraud.controller.js` (NEW)
- `be/models/fraudLog.model.js` (NEW)

### 5.4 Machine Learning Model (Optional Advanced)

**Tasks:**
- [ ] Collect training data
- [ ] Train ML model for fraud detection
- [ ] Integrate model predictions
- [ ] Continuously improve model

**Note**: This is advanced and can be Phase 7 or later.

---

## PHASE 6: Narad AI Agent (Week 8-12)

### 6.1 Narad Core Architecture

**Tasks:**
- [ ] Design Narad agent system
- [ ] Create user analysis pipeline
- [ ] Implement content classification
- [ ] Build risk scoring system

**Narad Components:**

1. **User Data Collector**: Fetch user posts, comments, activity
2. **Content Analyzer**: NLP analysis, sentiment, topic classification
3. **Risk Scorer**: Calculate risk scores
4. **Report Generator**: Create probabilistic reports
5. **Response System**: Generate appropriate responses

**Files Structure:**
```
be/
  narad/
    collector/
      userDataCollector.js
    analyzer/
      contentAnalyzer.js
      sentimentAnalyzer.js
      topicClassifier.js
    scorer/
      riskScorer.js
    generator/
      reportGenerator.js
    naradAgent.js
```

### 6.2 Content Analysis Pipeline

**Tasks:**
- [ ] Integrate OpenAI/Claude for content analysis
- [ ] Implement topic classification
- [ ] Add sentiment analysis
- [ ] Detect misinformation signals (probabilistic)

**Content Categories:**
- Politics
- Religion
- Technology
- Finance
- Entertainment
- Hate/Abuse
- Neutral

**Files to Create:**
- `be/narad/analyzer/contentAnalyzer.js`
- `be/narad/analyzer/sentimentAnalyzer.js`
- `be/narad/analyzer/topicClassifier.js`

### 6.3 Risk Scoring Model

**Tasks:**
- [ ] Implement hate speech risk scoring
- [ ] Add polarization risk scoring
- [ ] Create harassment risk scoring
- [ ] Build misinformation amplification risk

**Scoring Formula:**
```
Each risk score (0-100):
- Hate Speech Risk: Based on toxicity detection
- Polarization Risk: Based on us-vs-them language
- Harassment Risk: Based on attack patterns
- Misinformation Risk: Based on unverified claims, low-credibility sources

Overall Risk = Weighted average of individual risks
```

**Files to Create:**
- `be/narad/scorer/riskScorer.js`

### 6.4 Report Generation

**Tasks:**
- [ ] Create report templates
- [ ] Generate probabilistic language reports
- [ ] Build dashboard data structure
- [ ] Implement safety disclaimers

**Report Format:**

```javascript
{
  user: "@username",
  analysisPeriod: "Last 90 days",
  summary: {
    dominantTopics: [...],
    tone: "Emotionally charged",
    misinformationRisk: "Medium",
    overallRisk: "Medium-High"
  },
  riskScores: {
    hateRisk: 15,
    polarizationRisk: 62,
    harassmentRisk: 20,
    misinformationRisk: 48
  },
  disclaimer: "This is an automated AI analysis, not a factual judgment."
}
```

**Files to Create:**
- `be/narad/generator/reportGenerator.js`

### 6.5 Narad Integration (Optional - Mention System)

**Tasks:**
- [ ] Create mention detection system
- [ ] Parse "@Narad analyze @username" commands
- [ ] Generate and post reports
- [ ] Create dashboard for detailed reports

**Note**: This assumes you want Narad as a mentionable bot. If not, skip this and use direct API calls.

### 6.6 Narad Dashboard

**Tasks:**
- [ ] Create detailed report page
- [ ] Show charts and visualizations
- [ ] Display example content (anonymized)
- [ ] Show methodology

**Files to Create:**
- `fe/vite-project/src/pages/narad/NaradReport.jsx`
- `fe/vite-project/src/components/narad/RiskScores.jsx`
- `fe/vite-project/src/components/narad/TopicBreakdown.jsx`

---

## PHASE 7: Testing & Quality Assurance (Week 12-13)

### 7.1 Unit Testing

**Tasks:**
- [ ] Test balance utilities
- [ ] Test scoring algorithms
- [ ] Test fraud detection
- [ ] Test evaluation engine

**Tools**: Jest, Supertest

### 7.2 Integration Testing

**Tasks:**
- [ ] Test complete reward flow
- [ ] Test evaluation cycle
- [ ] Test fraud detection integration
- [ ] Test Narad analysis pipeline

### 7.3 Load Testing

**Tasks:**
- [ ] Test with high user loads
- [ ] Test evaluation job performance
- [ ] Optimize database queries
- [ ] Add caching where needed

**Tools**: Artillery, k6

### 7.4 Security Testing

**Tasks:**
- [ ] Test authentication security
- [ ] Test balance manipulation attempts
- [ ] Test fraud bypass attempts
- [ ] Security audit

---

## PHASE 8: Deployment & Production (Week 13-14)

### 8.1 Environment Setup

**Tasks:**
- [ ] Set up production MongoDB
- [ ] Configure environment variables
- [ ] Set up Redis for caching (optional)
- [ ] Configure CDN for images

### 8.2 CI/CD Pipeline

**Tasks:**
- [ ] Set up GitHub Actions
- [ ] Automated testing
- [ ] Automated deployment
- [ ] Rollback procedures

### 8.3 Monitoring & Logging

**Tasks:**
- [ ] Set up error tracking (Sentry)
- [ ] Set up application monitoring
- [ ] Set up logging system
- [ ] Create alerts for critical issues

### 8.4 Documentation

**Tasks:**
- [ ] API documentation (Swagger)
- [ ] User guide
- [ ] Admin guide
- [ ] Deployment guide

---

## 📝 Detailed Implementation Steps (Priority Order)

### IMMEDIATE (This Week)

1. **Update Fee Constants**
   - Change COMMENT_FEE to 10
   - Change LIKE_FEE to 1
   - Create rewardConfig.js

2. **Create Transaction Model**
   - Design schema
   - Implement transaction logging
   - Update all balance operations

3. **Implement Fee Splitting**
   - Update balanceUtils to split fees
   - Track prize pool, platform fee, liker reserve separately

4. **Add Time Window Validation**
   - Create timeUtils.js
   - Add freeze period checks
   - Block actions during 6 AM - 8 AM

### SHORT TERM (Next 2 Weeks)

5. **Build Scoring System**
   - Implement post scoring
   - Implement comment scoring
   - Add reputation bonuses

6. **Create Evaluation Engine**
   - Set up cron job
   - Implement evaluation logic
   - Test with sample data

7. **Frontend Balance Display**
   - Show balance in sidebar
   - Create transaction history page
   - Update balance on actions

### MEDIUM TERM (Weeks 3-5)

8. **Daily Limits System**
   - Track daily counts
   - Add limit middleware
   - Reset logic

9. **Reputation System**
   - Calculate reputation
   - Update on wins/losses
   - Display in UI

10. **Basic Fraud Detection**
    - Pattern detection
    - Flag suspicious activity
    - Log fraud attempts

### LONG TERM (Weeks 6+)

11. **AI Fraud Detection**
    - Integrate AI APIs
    - Advanced pattern analysis
    - Automated responses

12. **Narad AI Agent**
    - Content analysis
    - Risk scoring
    - Report generation

---

## 🔧 Technical Specifications

### Backend Dependencies to Add

```json
{
  "node-cron": "^3.0.3",           // For scheduled jobs
  "openai": "^4.20.0",              // For AI analysis (optional)
  "@anthropic-ai/sdk": "^0.20.0",   // Alternative AI (optional)
  "ioredis": "^5.3.2",              // Caching (optional)
  "express-rate-limit": "^7.1.5",   // Rate limiting
  "helmet": "^7.1.0",               // Security
  "compression": "^1.7.4"           // Compression
}
```

### Environment Variables Needed

```env
# Existing
PORT=5001
MONGODB_URI=mongodb://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
JWT_SECRET=...

# New
OPENAI_API_KEY=...              # For AI features (optional)
ANTHROPIC_API_KEY=...           # Alternative AI (optional)
REDIS_URL=...                   # For caching (optional)
NODE_ENV=production
EVALUATION_TIMEZONE=Asia/Kolkata # Adjust for your timezone
```

### API Endpoints to Add

```
POST   /api/evaluation/run           # Manual evaluation trigger (admin)
GET    /api/evaluation/latest        # Get latest evaluation results
GET    /api/transactions/history     # User transaction history
GET    /api/user/reputation          # Get user reputation
POST   /api/fraud/flag               # Flag suspicious activity (admin)
GET    /api/fraud/logs               # Get fraud logs (admin)
GET    /api/narad/analyze/:username  # Analyze user (Narad)
POST   /api/narad/report             # Generate detailed report
GET    /api/pool/current             # Get current pool status
GET    /api/winners/recent           # Get recent winners
```

---

## 🛡️ Anti-Fraud Strategies

### Detection Mechanisms

1. **Behavioral Analysis**
   - Action velocity (too fast = suspicious)
   - Interaction patterns (coordinated = suspicious)
   - Time-based anomalies

2. **Network Analysis**
   - User interaction graphs
   - Cluster detection
   - Isolation of coordinated groups

3. **Content Analysis**
   - Duplicate/similar comments
   - Low-quality engagement
   - Spam patterns

4. **Account Analysis**
   - New account penalties
   - Suspicious verification patterns
   - Device/browser fingerprinting

### Response Mechanisms

1. **Automatic**
   - Reduce reputation
   - Limit daily actions
   - Flag for review

2. **Semi-Automatic**
   - Admin review queue
   - Temporary suspension
   - Reward forfeiture

3. **Manual**
   - Permanent ban
   - Legal action (extreme cases)

---

## 🤖 Narad AI Implementation Details

### Analysis Pipeline Flow

```
User Request → Data Collection → Content Analysis → Risk Scoring → Report Generation → Response
```

### Data Collection

```javascript
// Collect user data
const userData = {
  profile: await getUserProfile(username),
  posts: await getUserPosts(username, { limit: 100, days: 90 }),
  comments: await getUserComments(username, { limit: 200, days: 90 }),
  interactions: await getUserInteractions(username),
  accountAge: await getAccountAge(username)
};
```

### Content Analysis

```javascript
// Analyze content using AI
const analysis = await aiAnalyze({
  posts: userData.posts,
  comments: userData.comments,
  prompt: NARAD_ANALYSIS_PROMPT
});

// Returns:
// - Topic distribution
// - Sentiment scores
// - Toxicity levels
// - Misinformation signals
```

### Risk Scoring

```javascript
const risks = {
  hateRisk: calculateHateRisk(analysis),
  polarizationRisk: calculatePolarizationRisk(analysis),
  harassmentRisk: calculateHarassmentRisk(analysis),
  misinformationRisk: calculateMisinformationRisk(analysis)
};
```

### Report Generation

```javascript
const report = {
  summary: generateSummary(analysis, risks),
  detailedBreakdown: generateDetailedBreakdown(analysis),
  recommendations: generateRecommendations(risks),
  disclaimer: NARAD_DISCLAIMER
};
```

---

## 📊 Database Indexes to Add

```javascript
// Post indexes
db.posts.createIndex({ createdAt: -1 });
db.posts.createIndex({ user: 1, createdAt: -1 });
db.posts.createIndex({ evaluated: 1, freezePeriod: 1 });
db.posts.createIndex({ score: -1 });

// Transaction indexes
db.transactions.createIndex({ user: 1, createdAt: -1 });
db.transactions.createIndex({ type: 1, createdAt: -1 });
db.transactions.createIndex({ relatedPost: 1 });

// User indexes
db.users.createIndex({ reputation: -1 });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ email: 1 });

// Fraud log indexes
db.fraudlogs.createIndex({ user: 1, createdAt: -1 });
db.fraudlogs.createIndex({ severity: 1, resolved: 1 });
```

---

## 🚨 Important Considerations

### Legal & Ethical

1. **Privacy**
   - Don't store IP addresses without consent
   - Anonymize data in reports
   - GDPR compliance if needed

2. **Disclaimers**
   - All AI analysis must be probabilistic
   - Clear disclaimers on Narad reports
   - No definitive accusations

3. **Fairness**
   - Transparent scoring algorithms
   - Appeal process for fraud flags
   - Human review option

### Performance

1. **Evaluation Job**
   - Should complete within 2 hours
   - Use batch processing
   - Add progress tracking

2. **Database**
   - Index frequently queried fields
   - Use aggregation pipelines
   - Consider read replicas

3. **Caching**
   - Cache daily pool data
   - Cache user reputation
   - Cache Narad reports (with TTL)

### Security

1. **Authentication**
   - Secure JWT implementation
   - Rate limiting on auth endpoints
   - Account lockout after failed attempts

2. **Balance Security**
   - Atomic transactions
   - Double-entry bookkeeping
   - Audit logs for all balance changes

3. **API Security**
   - Input validation
   - SQL injection prevention (MongoDB is safe, but validate)
   - XSS prevention in content

---

## 📅 Estimated Timeline

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: Foundation | 1-2 weeks | Critical |
| Phase 2: Evaluation System | 1 week | Critical |
| Phase 3: Frontend Enhancements | 1 week | High |
| Phase 4: Rate Limiting | 1 week | High |
| Phase 5: Anti-Fraud | 2-3 weeks | High |
| Phase 6: Narad AI | 4-5 weeks | Medium |
| Phase 7: Testing | 1-2 weeks | Critical |
| Phase 8: Deployment | 1 week | Critical |

**Total Estimated Time**: 12-16 weeks (3-4 months)

---

## 🎯 Success Metrics

### Platform Health
- Daily active users
- Posts/comments/likes per day
- Average user balance
- Reward distribution fairness

### Fraud Detection
- False positive rate (< 5%)
- Fraud detection rate (> 90%)
- Response time to fraud

### User Engagement
- Post quality (measured by engagement)
- Comment quality
- User retention rate

### Narad AI
- Analysis accuracy
- User satisfaction with reports
- Report generation time

---

## 📚 Additional Resources

### Documentation to Create
1. API Documentation (Swagger/OpenAPI)
2. Database Schema Documentation
3. Deployment Guide
4. Admin Manual
5. User Guide

### Code Examples Needed
1. Evaluation job complete implementation
2. Fraud detection complete implementation
3. Narad AI complete implementation
4. Frontend components

---

## 🚀 Getting Started

### Step 1: Set Up Development Environment
```bash
# Install new dependencies
cd be
npm install node-cron express-rate-limit helmet compression

# Set up environment variables
cp .env.example .env
# Add new variables
```

### Step 2: Create Transaction Model
```bash
# Create the model file
touch be/models/transaction.model.js
# Implement as specified above
```

### Step 3: Update Fee Constants
```bash
# Create config file
touch be/config/rewardConfig.js
# Update controllers to use new fees
```

### Step 4: Implement Time Validation
```bash
# Create time utilities
touch be/lib/utils/timeUtils.js
# Add validation to controllers
```

### Step 5: Start Building Evaluation System
```bash
# Create evaluation controller
mkdir -p be/jobs be/controllers
touch be/jobs/evaluationJob.js
touch be/controllers/evaluation.controller.js
```

---

## 💡 Next Steps

1. **Review this roadmap** and prioritize features
2. **Set up project management** (GitHub Projects, Trello, etc.)
3. **Create detailed tickets** for each phase
4. **Start with Phase 1** - Foundation
5. **Iterate and test** as you build

---

## 📞 Support & Questions

If you need clarification on any part of this roadmap:
- Review the code examples provided
- Check the detailed implementation sections
- Start with Phase 1 and build incrementally
- Test each phase before moving to the next

---

**Good luck with your project! 🚀**

This roadmap provides a comprehensive guide to building your reward-based social media platform with AI-powered fraud detection and the Narad AI agent. Follow it step by step, and you'll have a production-ready platform!

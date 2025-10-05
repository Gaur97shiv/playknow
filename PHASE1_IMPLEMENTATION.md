# Phase 1 Implementation - Reward System Foundation

## Overview
This document outlines the Phase 1 implementation of the reward system for your X-like social media platform. Phase 1 focuses on establishing the foundation with balance management, fee collection, and basic pool tracking.

## 🎯 Phase 1 Goals Achieved

### ✅ 1. User Balance System
- **Initial Balance**: All users get 100 coins upon registration
- **Balance Field**: Added to User schema with validation (minimum 0)
- **Balance API**: Endpoint to check current user balance

### ✅ 2. Posting Fee System (20 coins)
- **Fee Collection**: 20 coins deducted when creating a post
- **Balance Validation**: Users cannot post without sufficient balance
- **Daily Pool**: Posting fees go to daily pool for distribution
- **Error Handling**: Refunds users if pool update fails

### ✅ 3. Commenting Fee System (5 coins)
- **Fee Collection**: 5 coins deducted when commenting on posts
- **Post Pool**: Comment fees go to the specific post's pool
- **Balance Validation**: Users cannot comment without sufficient balance

### ✅ 4. Liking Fee System (2 coins)
- **Fee Collection**: 2 coins deducted when liking posts
- **Post Pool**: Like fees go to the specific post's pool
- **Unlike**: No fee for unliking posts
- **Balance Validation**: Users cannot like without sufficient balance

### ✅ 5. Random Post Ordering
- **Shuffling**: Posts are randomly ordered using Math.random
- **Applied To**: Both `getAllPosts` and `getFollowingPosts` endpoints

### ✅ 6. Pool Tracking System
- **Daily Pool**: Tracks total coins collected per day from posts
- **Post Pool**: Tracks coins per individual post from comments and likes
- **Pool APIs**: Endpoints to view current and historical pool data

## 📁 Files Modified/Created

### Database Models
- `be/models/user.model.js` - Added balance field
- `be/models/post.model.js` - Added total_coin_on_post field
- `be/models/dailyPool.model.js` - New model for daily pool tracking

### Controllers
- `be/controllers/post.controller.js` - Updated with fee logic for post/comment/like
- `be/controllers/user.controller.js` - Added getUserBalance endpoint
- `be/controllers/pool.controller.js` - New controller for pool management

### Utilities
- `be/lib/utils/balanceUtils.js` - Helper functions for balance operations

### Routes
- `be/routes/user.routes.js` - Added balance endpoint
- `be/routes/pool.routes.js` - New routes for pool management
- `be/server.js` - Added pool routes

## 🔧 API Endpoints

### User Balance
```
GET /api/user/balance
```
**Response:**
```json
{
  "balance": 80,
  "userName": "john_doe"
}
```

### Daily Pool
```
GET /api/pool/daily
```
**Response:**
```json
{
  "date": "2024-01-15",
  "total_pool_coins": 200,
  "posts_count": 10
}
```

### Pool History
```
GET /api/pool/history
```
**Response:**
```json
[
  {
    "date": "2024-01-15",
    "total_pool_coins": 200,
    "posts_count": 10
  }
]
```

### Updated Post Creation
```
POST /api/post/create
```
**Response:**
```json
{
  "message": "Post created successfully",
  "post": { /* post object */ },
  "balance": 80,
  "dailyPool": { /* pool object */ }
}
```

### Updated Comment
```
POST /api/post/commentOnPost/:id
```
**Response:**
```json
{
  "message": "Comment added successfully",
  "post": { /* updated post object */ },
  "balance": 75
}
```

### Updated Like
```
POST /api/post/likeOrUnlike/:id
```
**Response:**
```json
{
  "likes": [/* array of user IDs */],
  "balance": 73,
  "post": { /* updated post object */ }
}
```

## 💰 Fee Structure (Phase 1)

| Action | Fee | Destination |
|--------|-----|-------------|
| Post Creation | 20 coins | Daily Pool |
| Comment | 5 coins | Post Pool |
| Like | 2 coins | Post Pool |
| Unlike | 0 coins | - |

## 🛡️ Error Handling

### Insufficient Balance
```json
{
  "error": "Insufficient balance. Required: 20, Available: 15"
}
```

### Database Errors
- Automatic refunds if pool updates fail
- Transaction-like behavior for critical operations
- Proper error messages for debugging

## 🎲 Random Post Ordering

Posts are shuffled using `Math.random()` in:
- `getAllPosts()` - All posts feed
- `getFollowingPosts()` - Following feed

This ensures content discovery and prevents chronological bias.

## 🗃️ Database Schema Updates

### User Schema
```javascript
{
  // ... existing fields
  balance: {
    type: Number,
    default: 100,
    min: 0
  }
}
```

### Post Schema
```javascript
{
  // ... existing fields
  total_coin_on_post: {
    type: Number,
    default: 0
  }
}
```

### DailyPool Schema
```javascript
{
  date: String, // YYYY-MM-DD format
  total_pool_coins: Number,
  posts_count: Number
}
```

## 🚀 Next Steps for Phase 2

1. **Reward Distribution System**
   - Implement daily/weekly reward distribution
   - Winner selection based on engagement metrics
   - Liker rewards for winning posts

2. **Advanced Pool Management**
   - Platform fee allocation
   - Liker reward reserve
   - Anti-fraud mechanisms

3. **User Experience Enhancements**
   - Balance display in UI
   - Fee notifications
   - Pool statistics dashboard

4. **Analytics & Monitoring**
   - Transaction logging
   - Pool performance metrics
   - User spending patterns

## 🔍 Testing Recommendations

1. **Balance Operations**
   - Test insufficient balance scenarios
   - Verify refund mechanisms
   - Check balance updates after each action

2. **Pool Tracking**
   - Verify daily pool accumulation
   - Check post pool updates
   - Test pool history retrieval

3. **Random Ordering**
   - Verify posts are shuffled
   - Test consistency across requests

4. **Error Scenarios**
   - Network failures during transactions
   - Database connection issues
   - Invalid user/post IDs

## 📊 Expected Behavior

- Users start with 100 coins
- Each post costs 20 coins
- Each comment costs 5 coins  
- Each like costs 2 coins
- Daily pool accumulates posting fees
- Post pools accumulate comment/like fees
- Posts appear in random order
- All operations include balance validation

This Phase 1 implementation provides a solid foundation for the complete reward system while maintaining data integrity and user experience.

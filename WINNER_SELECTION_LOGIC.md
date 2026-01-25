# Winner Selection Logic - Implementation Details

## Overview

The winner selection system evaluates posts and comments daily at 6 AM, selecting winners based on calculated scores and distributing rewards.

## Winner Selection Process

### 1. Post Winner Selection

**Step 1: Get Eligible Posts**
- Retrieves all posts created between 8 AM yesterday and 6 AM today
- Only includes posts that haven't been evaluated yet (`evaluated: false`)

**Step 2: Calculate Scores**
- Each post gets a score calculated using the formula:
  ```
  Score = (likes × 1) + (comments × 2) + (reputation_bonus)
  Score = Score × (1 + account_age_multiplier)
  ```
- Reputation bonus = `user.reputation × 0.1`
- Account age multiplier = up to 10% boost for accounts older than 1 year

**Step 3: Sort and Select Winner**
- Posts are sorted by score (descending)
- **Tie-breaker**: If two posts have the same score, the newer post wins
- The post with the highest score (index 0) is selected as the winner

**Step 4: Distribute Rewards**
- Winner receives 80% of the post's pool (`post_pool_coins`)
- Winner gets +5 reputation points (capped at 100)
- All users who liked the winning post receive 3 coins each

### 2. Comment Winner Selection

**Step 1: Evaluate Comments on Winning Post**
- Only comments on the winning post are evaluated
- Each comment gets a score:
  ```
  Score = (likes × 1) + (replies × 2) + (reputation_bonus)
  Score = Score × (1 + account_age_multiplier)
  ```

**Step 2: Sort and Select Winner**
- Comments are sorted by score (descending)
- **Tie-breaker**: If two comments have the same score, the newer comment wins
- The comment with the highest score (index 0) is selected as the winner

**Step 3: Distribute Rewards**
- Winner receives 80% of the comment pool (`comment_pool_coins`)
- Winner gets +3 reputation points (capped at 100)
- (Future: Users who liked the winning comment receive 2 coins each)

## Key Features

### Tie-Breaking Mechanism
- **Posts**: If scores are equal, newer post wins
- **Comments**: If scores are equal, newer comment wins
- This ensures fairness and prevents ambiguity

### Scoring Formula Details

**Post Score Components:**
- `likes × 1`: Each like contributes 1 point
- `comments × 2`: Each comment contributes 2 points (encourages discussion)
- `reputation_bonus`: User's reputation × 0.1 (rewards quality users)
- `age_multiplier`: Up to 10% boost for established accounts

**Comment Score Components:**
- `likes × 1`: Each like contributes 1 point
- `replies × 2`: Each reply contributes 2 points (encourages discussion)
- `reputation_bonus`: User's reputation × 0.1
- `age_multiplier`: Up to 10% boost for established accounts

### Reward Distribution

**Post Winner:**
- 80% of `post_pool_coins` → Post author
- 20% stays in platform/reserve
- 3 coins → Each user who liked the post

**Comment Winner:**
- 80% of `comment_pool_coins` → Comment author
- 20% stays in platform/reserve
- (Future: 2 coins → Each user who liked the comment)

### Reputation Updates

- **Post Winner**: +5 reputation (capped at 100)
- **Comment Winner**: +3 reputation (capped at 100)
- Reputation affects future scoring (higher reputation = higher scores)

## Evaluation Schedule

- **Evaluation Time**: Daily at 6:00 AM
- **Evaluation Period**: Posts from 8 AM yesterday to 6 AM today (22 hours)
- **Freeze Period**: 6 AM - 8 AM (no actions allowed)
- **Active Period**: 8 AM - 6 AM next day (actions allowed)

## Logging

The system provides detailed logging:
- Total posts/comments evaluated
- Winner selection details
- Score calculations
- Pool amounts and rewards
- Distribution confirmations

## Example Flow

```
1. Evaluation starts at 6:00 AM
2. Finds 15 posts from evaluation period
3. Calculates scores for all 15 posts
4. Sorts by score: [45.2, 38.5, 32.1, ...]
5. Selects post with score 45.2 as winner
6. Evaluates 8 comments on winning post
7. Calculates comment scores: [12.5, 9.3, 7.8, ...]
8. Selects comment with score 12.5 as winner
9. Distributes rewards:
   - Post winner: 80% of post pool
   - Comment winner: 80% of comment pool
   - Likers: 3 coins each
10. Updates reputation
11. Marks all posts as evaluated
```

## Edge Cases Handled

1. **No Posts**: Returns success with empty winners array
2. **No Comments**: Comment winner is null, only post winner selected
3. **Zero Pool**: Rewards are 0, but winner is still selected
4. **Tied Scores**: Newer post/comment wins (tie-breaker)
5. **No Likes**: Liker rewards are skipped
6. **Reputation Cap**: Reputation never exceeds 100

## Testing

To test the winner selection manually:
```bash
POST /api/evaluation/run
```

This triggers evaluation immediately (useful for testing).

## Future Enhancements

1. Multiple winners (top 3 posts, top 3 comments)
2. Category-based winners
3. Weekly/monthly winners
4. Special event winners
5. Comment likes functionality (for liker rewards)

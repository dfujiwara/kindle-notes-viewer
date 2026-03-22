export interface TweetThread {
  id: string;
  rootTweetId: string;
  authorUsername: string;
  authorDisplayName: string;
  title: string;
  tweetCount: number;
  fetchedAt: string;
  createdAt: string;
}

export interface Tweet {
  id: string;
  tweetId: string;
  authorUsername: string;
  authorDisplayName: string;
  content: string;
  mediaUrls: string[];
  threadId: string;
  positionInThread: number;
  tweetedAt: string;
  createdAt: string;
}

export interface TweetThreadBundle {
  thread: TweetThread;
  tweets: Tweet[];
}

export interface TweetDetailedContent {
  thread: TweetThread;
  tweet: Tweet;
  additionalContext: string;
  relatedTweets: Tweet[];
}

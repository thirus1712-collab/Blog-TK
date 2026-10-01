require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const clearData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog_tk';
    await mongoose.connect(mongoUri);
    console.log('[Cleanup] Connected to MongoDB at:', mongoUri);

    const usersResult = await User.deleteMany({});
    console.log(`[Cleanup] Deleted ${usersResult.deletedCount} document(s) from Users collection.`);

    const postsResult = await Post.deleteMany({});
    console.log(`[Cleanup] Deleted ${postsResult.deletedCount} document(s) from Posts collection.`);

    const commentsResult = await Comment.deleteMany({});
    console.log(`[Cleanup] Deleted ${commentsResult.deletedCount} document(s) from Comments collection.`);

    console.log('[Cleanup] Database is now completely clean and empty.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Cleanup Error]', error);
    process.exit(1);
  }
};

clearData();

const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Helper to build date range query for a specific day
const getDateRange = (dateString) => {
  if (!dateString) return null;
  // Format expected: YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);

  const startOfDay = new Date(year, month, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month, day, 23, 59, 59, 999);

  return { $gte: startOfDay, $lte: endOfDay };
};

// Helper to build rating range query for rounded star rating (1-5)
const getRatingRange = (ratingValue) => {
  const r = parseInt(ratingValue, 10);
  if (isNaN(r) || r < 1 || r > 5) return null;

  if (r === 5) {
    return { $gte: 4.5, $lte: 5.0 };
  } else if (r === 1) {
    return { $gte: 0.5, $lt: 1.5 };
  } else {
    return { $gte: r - 0.5, $lt: r + 0.5 };
  }
};

// @desc    Get all posts (supports search, date, rating, mine)
// @route   GET /api/posts
// @access  Public (mine=true requires token)
const getPosts = async (req, res, next) => {
  try {
    const { search, date, rating, mine } = req.query;
    const query = {};

    // Search filter (title or content)
    if (search && search.trim() !== '') {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { content: { $regex: term, $options: 'i' } }
      ];
    }

    // Date filter
    if (date) {
      const dateRange = getDateRange(date);
      if (dateRange) {
        query.createdAt = dateRange;
      }
    }

    // Rating filter
    if (rating && rating !== 'all') {
      const ratingRange = getRatingRange(rating);
      if (ratingRange) {
        query.averageRating = ratingRange;
      }
    }

    // Mine toggle filter
    if (mine === 'true') {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to view your own posts.'
        });
      }
      query.author = req.user._id;
    }

    const posts = await Post.find(query)
      .populate('author', 'name profession email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's posts (My Posts)
// @route   GET /api/posts/mine
// @access  Private
const getMyPosts = async (req, res, next) => {
  try {
    const { search, date, rating } = req.query;
    const query = { author: req.user._id };

    // Search filter
    if (search && search.trim() !== '') {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { content: { $regex: term, $options: 'i' } }
      ];
    }

    // Date filter
    if (date) {
      const dateRange = getDateRange(date);
      if (dateRange) {
        query.createdAt = dateRange;
      }
    }

    // Rating filter
    if (rating && rating !== 'all') {
      const ratingRange = getRatingRange(rating);
      if (ratingRange) {
        query.averageRating = ratingRange;
      }
    }

    const totalUserPosts = await Post.countDocuments({ author: req.user._id });
    const posts = await Post.find(query)
      .populate('author', 'name profession email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      totalCount: totalUserPosts,
      filteredCount: posts.length,
      posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'name profession email'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    let userRating = null;
    if (req.user) {
      const found = post.ratings.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (found) {
        userRating = found.value;
      }
    }

    res.json({
      success: true,
      post,
      userRating
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { title, content, contactEmail, contactPhone } = req.body;

    if (!title || !content || !contactEmail || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (title, content, email, phone).'
      });
    }

    if (!req.processedImages || !req.processedImages.thumbnail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image for the post (JPG, PNG, WEBP max 5MB).'
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(contactEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid contact email address.'
      });
    }

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      image: req.processedImages,
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      author: req.user._id
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name profession email'
    );

    res.status(201).json({
      success: true,
      message: 'Post published successfully!',
      post: populatedPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing post
// @route   PUT /api/posts/:id
// @access  Private (Author only)
const updatePost = async (req, res, next) => {
  try {
    const { title, content, contactEmail, contactPhone } = req.body;
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Verify ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own posts.'
      });
    }

    if (!title || !content || !contactEmail || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.'
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(contactEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid contact email address.'
      });
    }

    post.title = title.trim();
    post.content = content.trim();
    post.contactEmail = contactEmail.trim();
    post.contactPhone = contactPhone.trim();

    // If new image was uploaded and processed
    if (req.processedImages && req.processedImages.thumbnail) {
      post.image = req.processedImages;
    }

    post.isEdited = true;
    post.editedAt = new Date();
    post.updatedAt = new Date();

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      'author',
      'name profession email'
    );

    res.json({
      success: true,
      message: 'Post updated successfully!',
      post: updatedPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post & related comments
// @route   DELETE /api/posts/:id
// @access  Private (Author only)
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Verify ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own posts.'
      });
    }

    // Cascade delete comments
    await Comment.deleteMany({ post: post._id });

    // Delete post
    await Post.findByIdAndDelete(post._id);

    res.json({
      success: true,
      message: 'Post and associated comments deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate a post (1 to 5 stars)
// @route   POST /api/posts/:id/rate
// @access  Private
const ratePost = async (req, res, next) => {
  try {
    const { value } = req.body;
    const numericValue = Number(value);

    if (!numericValue || numericValue < 1 || numericValue > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating between 1 and 5 stars.'
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user already rated
    const existingIndex = post.ratings.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingIndex > -1) {
      post.ratings[existingIndex].value = numericValue;
    } else {
      post.ratings.push({
        user: req.user._id,
        value: numericValue
      });
    }

    // Recalculate averageRating and ratingCount
    const count = post.ratings.length;
    const sum = post.ratings.reduce((acc, curr) => acc + curr.value, 0);
    const avg = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;

    post.averageRating = avg;
    post.ratingCount = count;

    await post.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully!',
      averageRating: post.averageRating,
      ratingCount: post.ratingCount,
      userRating: numericValue
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  ratePost
};

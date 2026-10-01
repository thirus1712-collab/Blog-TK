const express = require('express');
const router = express.Router();
const {
  getPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  ratePost
} = require('../controllers/postController');
const {
  getComments,
  addComment
} = require('../controllers/commentController');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadImage, processPostImage } = require('../middleware/upload');

// Public/filtered posts & post creation
router.get('/', optionalAuth, getPosts);
router.post('/', protect, uploadImage, processPostImage, createPost);

// IMPORTANT: Define /mine BEFORE /:id so "mine" is not treated as an :id parameter
router.get('/mine', protect, getMyPosts);

// Single post operations
router.get('/:id', optionalAuth, getPostById);
router.put('/:id', protect, uploadImage, processPostImage, updatePost);
router.delete('/:id', protect, deletePost);

// Ratings
router.post('/:id/rate', protect, ratePost);

// Comments
router.get('/:id/comments', getComments);
router.post('/:id/comments', protect, addComment);

module.exports = router;

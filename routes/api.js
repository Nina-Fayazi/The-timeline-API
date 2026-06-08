const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

// Post API
router.get('/api/get-posts', postController.getAllPosts);
router.post('/api/create-post', postController.postOnePost);
router.put('/api/edit-post/:id', postController.updateOnePost);
router.delete('/api/delete-post/:id', postController.deletePost);

// Comment Post API
router.get('/api/get-post-comments/:id', commentController.getAllCommentsPost);
router.post('/api/post-post-comment/:id', commentController.postOneComment);

module.exports = router;
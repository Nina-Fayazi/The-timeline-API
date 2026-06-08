const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');


router.post('/api/register', authController.register);
router.post('/api/login', authController.login);
router.post('/api/logout', authController.logout);


router.get('/api/get-posts', postController.getAllPosts);
router.post('/api/create-post', verifyToken, postController.postOnePost);
router.put('/api/edit-post/:id', verifyToken, postController.updateOnePost);
router.delete('/api/delete-post/:id', verifyToken, postController.deletePost);


router.get('/api/get-post-comments/:id', commentController.getAllCommentsPost);
router.post('/api/post-post-comment/:id', verifyToken, commentController.postOneComment);

module.exports = router;
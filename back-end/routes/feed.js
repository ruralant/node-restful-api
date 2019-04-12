const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');
const authenticate = require('../middleware/auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', authenticate, feedController.getPosts);

// POST /feed/post
router.post('/post', authenticate, [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
], feedController.createPost);

router.get('/post/:id', authenticate, feedController.getPost);

router.put('/post/:id', authenticate, [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
], feedController.updatePost);

router.delete('/post/:id', authenticate, feedController.deletePost);

module.exports = router;
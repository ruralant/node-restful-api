const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ message: 'Posts fetched successfully', posts });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed ');
      error.statusCode = 422;
      throw error;
    }

    const { title } = req.body;
    const { content } = req.body;
    let post = new Post({
      title,
      content,
      imageUrl: 'images/wolf.jpg', //for now 
      creator: { name: 'Antonio' },
    })
      post = await post.save();
      res.status(201).json({ message: 'Post created successfully!', post });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      const error = new Error('No post found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Post fetched', post });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
}

const { validationResult } = require('express-validator/check');

exports.getPosts = (req, res, next) => {
  // dummy data for the moment
  res.status(200).json({
    posts: [
      { 
        _id: '1',
        title: 'First Post', 
        content: 'This is the first post!',
        imageUrl: 'images/wolf.js',
        creator: {
          name: 'Antonio'
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed ', errors: errors.array() });
  }

  const { title } = req.body;
  const { content } = req.body;
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: { 
      _id: new Date().toISOString(), 
      title, 
      content, 
      creator: { name: 'Antonio' },
      createdAt: new Date()
    }
  });
};

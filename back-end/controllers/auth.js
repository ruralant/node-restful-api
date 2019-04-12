const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = error.array();
      throw error;
    }
    const { email, name, password } = req.body;
  
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name
    })
    await user.save();
    res.status(201).json({ message: 'User created successfully'});
  } catch (e) {
    console.log(e);
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('No user found');
      error.statusCode = 401;
      throw error;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error('Authentication error');
      error.statusCode = 401;
      throw error;
    }

    const token = await jwt.sign({
      email: user.email,
      userId: user._id.toString()
    }, process.env.SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, userId: user._id });
  } catch (e) {
    console.log(e);
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
}
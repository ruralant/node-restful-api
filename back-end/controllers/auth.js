const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

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
    res.status(201).json({ message: 'User created successully'});
  } catch (e) {
    console.log(e);
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
}
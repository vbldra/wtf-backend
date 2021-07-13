const User = require("../models/User");
const createError = require("http-errors");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

exports.addUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = new User(req.body);
    // const token = crypto.randomBytes(30).toString("hex");
    user.password = await bcrypt.hash(user.password, 10);
    // user.token = token;
    await user.save();
    delete user.password; // Maxim opinion,florian asked for help
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }).then(
    (user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error('User not found!')
        });
      }
      bcrypt.compare(req.body.password, user.password).then(
        (valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error('Incorrect password!')
            });
          }
          res.status(200).json({
            userId: user._id,
            token: 'token'
          });
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error
            
          });
        }
      );
    }
  ).catch(
    (error) => {
      res.status(500).json({
        error: error
      });
    }
  );
}

















exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) throw new createError.NotFound();
    await User.deleteOne({ _id: userId }, (err) => {
      if (err) throw new createError.NotFound();
    });
    return res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    console.log("logging in...");
    const user = await User.findOne({
      email: req.body.email,
    }).select("+password");
    console.log(req.body);
    

    if (!user) throw new createError.NotFound();
    const isCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    
    if (isCorrectPassword) {
      // const token = crypto.randomBytes(30).toString("hex");
      const token = jwt.sign(
        { user: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      
      res.json({ accessToken: token });
    } else {
      throw new createError.Unauthorized();
    }
  } catch (e) {
    next(e);
  }
};

exports.uploadMemory = async (req, res, next) => {
  try {
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

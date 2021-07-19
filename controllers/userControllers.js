const User = require("../models/User");
const createError = require("http-errors");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);








// adding a new user
exports.addUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = new User(req.body);
    //encrypt password
    user.password = await bcrypt.hash(user.password, 10);
    // generate token
    const emailToken = crypto.randomBytes(20).toString("hex");

    // store token
    user.emailToken = emailToken;
    const email = user.email;

    await user.save();
    // define email
    const msg = {
      to: email,
      from: "bocu.alexandru@gmail.com", // Use the email address or domain you verified above
      subject: "Greetings from Wir treffen Freunde",
      text: `Please click this link to verify your email address: ${process.env.SERVER_URL}users/verify/${emailToken}`,
    };

    // send email
    await sgMail.send(msg);
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};
//controller to verify email
exports.verifyEmail = async (req, res) => {
  //here use the same variable that is used in the verify route
  const { emailToken } = req.params;
  console.log("verify email");
  try {
    // find user that has this token
    const user = await User.findOne({ emailToken: emailToken });
    if (!user) {
      return res.status(401).json({
        error: new Error('User not found!')
      });
    }
    user.emailVerified = true;
    await user.save();
    res.send("Your email address has been verified.");
  } catch (err) {
    console.error(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const {email} = req.params;
  console.log("resetPassword");
  try {
    // generate token
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    const user = await User.findOne({ email: email });
    // store token
    user.resetPasswordToken = resetPasswordToken;
    const email = user.email;

    if (!user) {

      return res.status(401).json({
        error: new Error('User not found!')
      });
    }
    // define email
    const msg = {
      to: email,
      from: "bocu.alexandru@gmail.com", // Use the email address or domain you verified above
      subject: "Greetings from Wir treffen Freunde",
      text: `Please click this link to verify your email address: ${process.env.SERVER_URL}users/resetPassword/${resetPasswordToken}`,
    };

    // send email
    await sgMail.send(msg);
    res.status(200).send(user);
  } catch (error) {
    console.error(err);
    
  }
}


exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }).then(
    (user) => {
      // 1. user exists?
      if (!user) {
        return res.status(401).json({
          error: new Error('User not found!')
        });
      }
      // 2. password correct?
      bcrypt.compare(req.body.password, user.password).then(
        (valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error('Incorrect password!')
            });
          }
          // 3. email is verified?
          if(!user.emailVerified){
            return res.status(401).json({
              error: new Error('Please verify your Email before logging in!')
            })
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
exports.forgotPassword = async (res,req, next) =>  {
  const user = await User.findOne({email:req.body.email})
  if (!user) {
    return res.status(401).json({
      error: new Error('User not found!')
    });
  }

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

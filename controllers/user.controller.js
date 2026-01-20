const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const userSignup = async (req, res) => {
  try {
    const { fullname, email, mobile, password, role} = req.body;
    if (!fullname || !email || !mobile || !password) {
      res.status(400).json({
        message: "All filed required!",
      });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(409).json({
        message: "Email already registered",
      });
    }
    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      res.status(409).json({
        message: "Mobile number already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = new User({
      fullname,
      email,
      mobile,
      password: hashedPassword,
      role : role || "user"
    });
    await createUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        message: "Invalid email",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        message: "Invalid password",
      });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" },
    );
    res.status(200).json({
        success:true,
        message:"User login successfully!",
        token:token
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const userProfile = async (req,res) => {
    try {
        if(!req.user.id){
            res.status(404).json({
                message:"User id not found"
            })
        }
        const userDetails = await User.findById(req.user.id)
        res.status(200).json({
            success:true,
            data:userDetails
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports = {userSignup,userLogin,userProfile};
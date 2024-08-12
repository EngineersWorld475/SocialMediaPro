import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/helper/generateTokenSetCookie.js';

// Register user
export const signupUser = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;
    if (!name || !username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'user already exists' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      email,
    });
    await newUser.save();
    if (newUser) {
      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      });
    } else {
      return res.status(400).send({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
    console.log('Error in signup user', err.message);
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if ((!username, !password)) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(`Error in login user ${error.message}`);
  }
};

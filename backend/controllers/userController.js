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

// logout user
export const logoutUser = (req, res) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json({ message: 'User has been signed out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(`Error in login user ${error.message}`);
  }
};

// follow and unfollow user
export const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    //checking if the user trying to follow himself/herself
    if (id === req.user._id) {
      return res
        .status(400)
        .json({ message: 'You can not follow/unfollow yourself' });
    }
    if (!currentUser || !userToModify) {
      return res.status(400).json({ message: 'User not found' });
    }

    // checking if the current user is already following the other user
    const isFollowing = currentUser.following.includes(id);

    // if the current user already following the other user, we unfollow that. otherwise we follow the user
    if (isFollowing) {
      // unfollow user
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      return res.status(200).json({ message: 'User unfollowed successfully' });
    } else {
      // Follow user
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      return res.status(200).json({ message: 'User followed successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(`Error in follow/unfollow user ${error.message}`);
  }
};

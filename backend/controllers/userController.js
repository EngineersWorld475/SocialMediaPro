import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/helper/generateTokenSetCookie.js';
import { v2 as cloudinary } from 'cloudinary';

// Register user
export const signupUser = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;
    if (!name || !username || !password || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: 'user already exists' });
    }

    if (username) {
      if (username.includes(' ')) {
        return res
          .status(400)
          .json({ error: 'username can not include space' });
      }
      if (username !== username.toLowerCase()) {
        return res
          .status(400)
          .json({ error: 'username can not be capital letters' });
      }
    }

    if (password) {
      if (password.length < 7 || password.length > 20) {
        return res
          .status(400)
          .json({ error: 'password length should be between 7 and 20' });
      }
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
      return res.status(400).send({ error: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
    console.log('Error in signup user', err.message);
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if ((!username, !password)) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: 'You can not follow/unfollow yourself' });
    }
    if (!currentUser || !userToModify) {
      return res.status(400).json({ error: 'User not found' });
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
    res.status(500).json({ error: error.message });
    console.log(`Error in follow/unfollow user ${error.message}`);
  }
};

// update user profile
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, username, bio } = req.body;
    let { profilePic } = req.body;
    const userId = req.user._id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    if (id !== userId.toString()) {
      return res
        .status(400)
        .json({ error: `You can not update other users's profile` });
    }

    if (username) {
      if (username.includes(' ')) {
        return res
          .status(400)
          .json({ error: 'username can not include space' });
      }
      if (username !== username.toLowerCase()) {
        return res
          .status(400)
          .json({ error: 'username can not be capital letters' });
      }
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split('/').pop().split('.')[0]
        ); // if the profile picture already exists it deletes the current one and upload the new profile picture, instead of keeping the older one.
      }
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadResponse.secure_url;
    }

    let hashedPassword;
    if (password) {
      if (password.length < 7 || password.length > 20) {
        return res
          .status(400)
          .json({ error: 'password length should be between 7 and 20' });
      }
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = bcryptjs.hashSync(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          email,
          profilePic,
          username,
          bio,
        },
      },
      { new: true }
    );

    // password should be null in response
    user.password = null;

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send({ error: `Error in update user: ${error.message}` });
  }
};

// get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username })
      .select('-password')
      .select('-updatedAt');
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error in getting user profile: ${error.message}` });
  }
};

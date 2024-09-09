import Post from '../models/postModel.js';
import User from '../models/userModel.js';

// create post
export const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: 'PostedBy and text are required' });
    }
    const user = await User.findById(postedBy);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized to create a post' });
    }

    const maxLength = 600;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ message: `Text must be less than ${maxLength} characters` });
    }

    const newPost = new Post({
      postedBy,
      text,
      img,
    });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', newPost });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: `Error in create post: ${error.message}` });
  }
};

// get post
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Posts not found' });
    }

    res.status(200).json({ message: 'Post found', post });
  } catch (error) {
    console.log(error.messge);
    res.status(500).json({ message: `Error in get post: ${error.message}` });
  }
};

// delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: `Unauthorized to delete post` });
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: `Error in delete post: ${error.message}` });
  }
};

// like unlike post
export const likeUnlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user._id);
    if (isLiked) {
      await Post.findByIdAndUpdate(id, {
        $pull: { likes: req.user._id },
      });
      return res.status(200).json({ message: 'Unliked' });
    } else {
      await Post.findByIdAndUpdate(id, {
        $push: { likes: req.user._id },
      });
      return res.status(200).json({ message: 'liked' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: `Error in delete post: ${error.message}` });
  }
};

// replay to post
export const replyToPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const username = req.user.username;
    const userProfilePic = req.user.profilePic;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text field is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = { userId, username, userProfilePic, text };
    post.replies.push(reply);
    await post.save();
    return res.status(200).json({ message: 'Reply added successfully', post });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: `Error in delete post: ${error.message}` });
  }
};

// get feed posts
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const following = user.following;
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });
    res.status(200).json({ feedPosts });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: `Error in getting feed posts ${error.message}` });
  }
};

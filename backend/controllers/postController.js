import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary';

// create post
export const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;
    if (!postedBy || !text) {
      return res.status(400).json({ error: 'PostedBy and text are required' });
    }
    const user = await User.findById(postedBy);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Unauthorized to create a post' });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
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
      .json({ error: `Error in create post: ${error.message}` });
  }
};

// get post
export const getPost = async (req, res) => {
  try {
    const { postId } = req.query;
    const { userId } = req.query;
    if (postId) {
      const post = await Post.findById(postId);
      return res.status(200).json(post);
    }
    if (userId) {
      const post = await Post.find({ postedBy: userId }).populate('postedBy');
      return res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json({ error: `Error in get post: ${error.message}` });
  }
};

// delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: `Unauthorized to delete post` });
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: `Error in delete post: ${error.message}` });
  }
};

// like unlike post
export const likeUnlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
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
    res.status(500).json({ error: `Error in delete post: ${error.message}` });
  }
};

// replay to post
export const replyToPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text field is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const reply = { userId, text };
    post.replies.push(reply);
    await post.save();
    return res.status(200).json({ message: 'Reply added successfully', post });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: `Error in delete post: ${error.message}` });
  }
};

// get feed posts
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const following = user.following;
    following.push(userId);
    const feedPosts = await Post.find({ postedBy: { $in: following } })
      .populate('postedBy')
      .sort({
        createdAt: -1,
      });
    res.status(200).json(feedPosts);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: `Error in getting feed posts ${error.message}` });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const { pid, cid, uid } = req.query;

    if (uid !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: 'Sorry...you are not allowed to delete this comment' });
    }
    let currentPost = await Post.findById(pid);
    if (!currentPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const replyToRemove = currentPost.replies.find((reply) => reply._id == cid);

    if (!replyToRemove) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const updatedReply = currentPost.replies.filter(
      (reply) => reply._id.toString() !== cid.toString()
    );

    const updatedPost = await Post.findByIdAndUpdate(
      pid,
      {
        $set: {
          replies: updatedReply,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error in deleting reply ${error.message}` });
  }
};

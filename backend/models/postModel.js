import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: { 
    type: String,
    maxLength: 500,
  },
});

import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Types.ObjectId, ref: 'User',
    required: true,
  },
  replyingTo: {
    type: String,
    required: false,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  usersWhoLiked: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  ],
  usersWhoDisliked: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  ],
  replies: [{ 
    type: mongoose.Types.ObjectId,
    ref: 'Coment',
    }],

}, { timestamps: true});

export default mongoose.model("Coment", CommentSchema)
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    likes: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String },
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);

// At least one of text or image must be present
postSchema.pre('validate', function (next) {
  if (!this.text && !this.image) {
    this.invalidate('text', 'Either text or image is required');
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);

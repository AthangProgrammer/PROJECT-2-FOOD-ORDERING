const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true, // no two users with the same email
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'A valid email is required'],
    },
    password: { type: String, required: true }, // stores the bcrypt hash, never plain text
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  title: [String],
  options: [String],
  links: [String],  // URLs for each option
  parentKey: String // to track which menu this belongs to
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
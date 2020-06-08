const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, 'Please provide link to image'],
    },
    title: {
      type: String,
    },
    tag: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
    text: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const GalleryImage = mongoose.model('GalleryImage', gallerySchema);

module.exports = GalleryImage;

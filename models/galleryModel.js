const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Please provide link to image'],
  },
  title: {
    type: String,
  },
  tag: {
    type: String,
  },
});

const GalleryImage = mongoose.model('GalleryImage', gallerySchema);

module.exports = GalleryImage;

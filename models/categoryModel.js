const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The category name is required'],
    },
    categoryImage: {
      type: String,
      required: [true, 'Pleas enter the cover image for this category'],
    },
    categoryDescription: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

categorySchema.virtual('images', {
  ref: 'GalleryImage',
  foreignField: 'category',
  localField: '_id',
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;

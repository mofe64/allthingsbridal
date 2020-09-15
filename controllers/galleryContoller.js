const Gallery = require('../models/galleryModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getGalleryHome = catchAsync(async (req, res, next) => {
  res.status(200).render('galleryIndex');
});
exports.getGalleryImage = catchAsync(async (req, res, next) => {
  res.status(200).render('gallerySingle');
});
exports.getGalleryCategories = catchAsync(async (req, res, next) => {
  res.status(200).render('galleryCategories');
});
const Gallery = require('../models/galleryModel');
const Category = require('../models/categoryModel');
const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const moment = require('moment');

const author = 'Modupe Adebiyi';
//get blog home page
exports.getBlogHome = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  const featuredPosts = await Post.find({ featured: true });
  res.status(200).render('index', {
    posts,
    featuredPosts,
  });
});

exports.getBlogPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) {
    return next(new AppError('No post found with that slug'));
  }
  res.status(200).render('blogpost', {
    post,
    moment,
    author,
  });
});
//get gallery home page
exports.getGalleryHome = catchAsync(async (req, res, next) => {
  const galleryImages = await Gallery.find().populate({
    path: 'category',
    fields: 'name',
  });
  res.status(200).render('galleryIndex', {
    galleryImages,
  });
});
//get single gallery image
exports.getGalleryImage = catchAsync(async (req, res, next) => {
  const image = await Gallery.findById(req.params.id);
  res.status(200).render('gallerySingle', {
    image,
  });
});
//get the categories page in the gallery
exports.getGalleryCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).render('galleryCategories', {
    categories,
  });
});
//get about page
exports.getAbout = catchAsync(async (req, res, next) => {
  res.status(200).render('about');
});

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create(req.body);
  res.status(201).render('index');
});

exports.getPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).render('index', {
    posts,
  });
});

exports.getAdminHome = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  const images = await Gallery.find().populate({
    path: 'category',
    fields: 'name',
  });
  res.status(200).render('admin/adminHome', {
    posts,
    images,
    moment,
  });
});

exports.getCreatePostPage = catchAsync(async (req, res, next) => {
  res.status(200).render('admin/createPost');
});

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({
    title: req.body.title,
    introText: req.body.introText,
    post: req.body.post,
    coverImage: req.body.coverImage,
    featured: req.body.featured,
  });
  res.status(200).redirect('/admin');
});

exports.getPostEditPage = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug });
  //console.log(post);
  res.status(200).render('admin/editPost', {
    post,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  let isFeatured;
  if (req.body.featured) {
    isFeatured = true;
  } else {
    isFeatured = false;
  }
  const post = await Post.findOne({ slug: req.params.slug });
  const postID = post._id;
  if (!post) {
    return next(new AppError('Post not found', 404));
  }
  const updatedPost = await Post.findByIdAndUpdate(
    postID,
    {
      title: req.body.title,
      introText: req.body.introText,
      post: req.body.post,
      coverImage: req.body.coverImage,
      featured: isFeatured,
    },
    {
      runValidators: true,
      new: true,
    }
  );
  if (!updatedPost) {
    return next(
      new AppError(
        'Something went wrong updating that post please try again',
        500
      )
    );
  }
  res.status(200).redirect('/admin');
});

exports.getDeletePostPage = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug });
  res.status(200).render('admin/deletePost', {
    post,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) {
    return next(new AppError('No post found with that id', 404));
  }
  const postID = post._id;
  const deletedPost = await Post.findByIdAndDelete(postID);
  if (!deletedPost) {
    return next(
      new AppError('The post could not be deleted please try again later', 500)
    );
  }
  res.status(204).redirect('/admin/manageposts');
});
exports.getImageUploadPage = catchAsync(async (req, res, next) => {
  res.status(200).render('admin/uploadImages');
});
exports.getGalleryManagePage = catchAsync(async (req, res, next) => {
  const galleryImages = await Gallery.find().populate({
    path: 'category',
    fields: 'name',
  });
  res.status(200).render('admin/manageGallery', {
    galleryImages,
  });
});

exports.getPostManagePage = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).render('admin/managePosts', {
    posts,
  });
});

exports.getGalleryUploadPage = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).render('admin/newGalleryImage', {
    categories,
  });
});

exports.addImageToGallery = catchAsync(async (req, res, next) => {
  const tags = req.body.tag.split(',');
  const newImage = await Gallery.create({
    image: req.body.coverImage,
    title: req.body.title,
    tag: tags,
    category: req.body.category,
    text: req.body.text,
  });

  res.status(201).redirect('/admin/managegallery');
});

exports.getDeleteGalleryImage = catchAsync(async (req, res, next) => {
  const image = await Gallery.findById(req.params.id).populate({
    path: 'category',
    fields: 'name',
  });
  res.status(200).render('admin/deleteGalleryImage', {
    image,
    moment,
  });
});

exports.deleteGalleryImage = catchAsync(async (req, res, next) => {
  const image = await Gallery.findByIdAndDelete(req.params.id);
  res.status(204).redirect('/admin/managegallery');
});

exports.getCategoryPage = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).render('admin/category', {
    categories,
    moment,
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  let description;
  if (req.body.description == '') {
    description = `pictures of ${req.body.name}`;
  } else {
    description = req.body.description;
  }
  const newCategory = await Category.create({
    name: req.body.name,
    categoryImage: req.body.categoryImage,
    categoryDescription: description,
  });
  res.status(201).redirect('/admin/categories');
});

exports.getCategoryEditPage = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.status(200).render('admin/editCategory.ejs', {
    category,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  let description;
  if (req.body.description == '') {
    description = `pictures of ${req.body.name}`;
  } else {
    description = req.body.description;
  }
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      categoryImage: req.body.categoryImage,
      categoryDescription: description,
    },
    {
      runValidators: true,
      new: true,
    }
  );
  if (!updatedCategory) {
    return next(new AppError('No Category found with that id', 404));
  }
  res.status(200).redirect('/admin/categories');
});

exports.getCategoryDeletePage = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.status(200).render('admin/deleteCategory', {
    category,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError('No category found with that id', 404));
  }
  res.status(204).redirect('/admin/categories');
});

exports.getCategoryImages = catchAsync(async (req, res, next) => {
  const images = await Gallery.find({ category: req.params.id });
  //console.log(images);
  res.status(200).render('categoryImages', {
    images,
  });
});

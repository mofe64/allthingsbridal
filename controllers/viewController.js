const Gallery = require('../models/galleryModel');
const Category = require('../models/categoryModel');
const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const moment = require('moment');
const { findByIdAndUpdate } = require('../models/galleryModel');

const author = 'Modupe Adebiyi';

//get blog home page
exports.getBlogHome = catchAsync(async (req, res, next) => {
  const posts = await Post.find().sort('-createdAt');
  const featuredPosts = await Post.find({
    featured: true,
  })
    .limit(4)
    .sort('-createdAt');
  res.status(200).render('index', {
    posts,
    featuredPosts,
  });
});

//get single blog post
exports.getBlogPost = catchAsync(async (req, res, next) => {
  const latestPosts = await Post.find().limit(3);
  const post = await Post.findOne({
    slug: req.params.slug,
  });
  if (!post) {
    return next(new AppError('No post found with that slug'));
  }
  res.status(200).render('blogpost', {
    post,
    moment,
    author,
    latestPosts,
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

//create post
exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create(req.body);
  res.status(201).redirect('/admin/dashboard');
});

//get all posts
exports.getPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).render('index', {
    posts,
  });
});

//get admin dashboard
exports.getAdminHome = catchAsync(async (req, res, next) => {
  const posts = await Post.find().limit(10).sort('-createdAt');
  const images = await Gallery.find()
    .populate({
      path: 'category',
      fields: 'name',
    })
    .limit(5);
  res.status(200).render('admin/adminHome', {
    posts,
    images,
    moment,
  });
});

//get page to create a post
exports.getCreatePostPage = catchAsync(async (req, res, next) => {
  res.status(200).render('admin/createPost');
});

//create a post
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

// get page to edit a post
exports.getPostEditPage = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    slug: req.params.slug,
  });
  //console.log(post);
  res.status(200).render('admin/editPost', {
    post,
  });
});

//update a post
exports.updatePost = catchAsync(async (req, res, next) => {
  let isFeatured;
  if (req.body.featured) {
    isFeatured = true;
  } else {
    isFeatured = false;
  }
  const post = await Post.findOne({
    slug: req.params.slug,
  });
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
  res.status(200).redirect('/admin/dashboard');
});

//get page to delete a psot
exports.getDeletePostPage = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    slug: req.params.slug,
  });
  res.status(200).render('admin/deletePost', {
    post,
  });
});

//delete post
exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    slug: req.params.slug,
  });
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

//get page to upload image
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

//get page to manage posts
exports.getPostManagePage = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).render('admin/managePosts', {
    posts,
  });
});

// get page to upload image to gallery
exports.getGalleryUploadPage = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).render('admin/newGalleryImage', {
    categories,
  });
});

//add image to gallery
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

//get page to edit gallery image
exports.getGalleryImageEditPage = catchAsync(async (req, res, next) => {
  const image = await Gallery.findById(req.params.id).populate({
    path: 'category',
    fields: 'name',
  });
  const categories = await Category.find();
  res.status(200).render('admin/editGalleryImage', {
    image,
    moment,
    categories,
  });
});

// edit gallery image
exports.editImage = catchAsync(async (req, res, next) => {
  const image = await Gallery.findByIdAndUpdate(req.params.id, {
    image: req.body.coverImage,
    title: req.body.title,
    category: req.body.category,
    text: req.body.text,
  });
  res.status(200).redirect('/admin/managegallery');
});

//get page to delete gallery image
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

//delete gallery image
exports.deleteGalleryImage = catchAsync(async (req, res, next) => {
  const image = await Gallery.findByIdAndDelete(req.params.id);
  res.status(204).redirect('/admin/managegallery');
});

//get collections page
exports.getCategoryPage = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).render('admin/category', {
    categories,
    moment,
  });
});

//create a new collection
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

//get page to edit collections
exports.getCategoryEditPage = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.status(200).render('admin/editCategory.ejs', {
    category,
  });
});

//update collections
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

//get page to delete a collection
exports.getCategoryDeletePage = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.status(200).render('admin/deleteCategory', {
    category,
  });
});

//delete a collection
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError('No category found with that id', 404));
  }
  res.status(204).redirect('/admin/categories');
});

//get all images in a collection
exports.getCategoryImages = catchAsync(async (req, res, next) => {
  const images = await Gallery.find({
    category: req.params.id,
  }).sort('-createdAt');
  //console.log(images);
  res.status(200).render('categoryImages', {
    images,
  });
});

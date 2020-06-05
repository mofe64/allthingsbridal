const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError('No post found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({
    title: req.body.title,
    introText: req.body.introText,
    post: req.body.post,
    coverImage: req.body.coverImage,
    featured: req.body.featured,
  });
  res.status(201).json({
    status: 'success',
    data: {
      newPost,
    },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      introText: req.body.introText,
      post: req.body.post,
      coverImage: req.body.coverImage,
      featured: req.body.featured,
    },
    {
      runValidators: true,
      new: true,
    }
  );
  if (!post) {
    return next(new AppError('That post could not be found recheck id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    return next(new AppError('No post with that id found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

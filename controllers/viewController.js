const Gallery = require('../models/galleryModel');
const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getBlogHome = catchAsync(async (req, res, next) => {
  res.status(200).render('index');
});

exports.getGalleryHome = catchAsync(async (req, res, next) => {
  res.status(200).render('galleryIndex');
});
exports.getGalleryImage = catchAsync(async (req, res, next) => {
  res.status(200).render('gallerySingle');
});
exports.getGalleryCategories = catchAsync(async (req, res, next) => {
  res.status(200).render('galleryCategories');
});

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
  res.status(200).render('admin/adminHome', {
    posts,
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

exports.deletePost = catchAsync(async (req, res, next) => {});
exports.getImageUploadPage = catchAsync(async (req, res, next) => {
  res.status(200).render('admin/uploadImages');
});

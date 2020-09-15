const express = require('express');
//const postController = require('../controllers/postController');
//const adminController = require('../controllers/adminController');
//const galleryController = require('../controllers/galleryContoller');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

//blog routes
router.get('/', viewController.getBlogHome);
router.get('/post/:slug', viewController.getBlogPost);
router.get('/about', viewController.getAbout);
router.get('/gallery', viewController.getGalleryHome);
router.get('/gallery/image/:id', viewController.getGalleryImage);
router.get('/gallery/categories', viewController.getGalleryCategories);
router.get('/gallery/category/:id/images', viewController.getCategoryImages);

//admin routes
router.get('/login', authController.getLoginPage);
router.get('/admin', authController.getLoginPage);
router.post('/login', authController.login);
router.get('/register', authController.getRegisterPage);
router.post('/register', authController.register);
router.get(
  '/admin/dashboard',
  authController.ensureAuthenticated,
  viewController.getAdminHome
);
router.get('/admin/newpost', viewController.getCreatePostPage);
router.post('/admin/newpost', viewController.createPost);
router.get('/admin/editpost/:slug', viewController.getPostEditPage);
router.patch('/admin/editpost/:slug', viewController.updatePost);
router.get('/admin/uploadimage', viewController.getImageUploadPage);
router.get('/admin/managegallery', viewController.getGalleryManagePage);
router.get('/admin/manageposts', viewController.getPostManagePage);
router.get('/admin/newgalleryimage', viewController.getGalleryUploadPage);
router.post('/admin/newgalleryimage', viewController.addImageToGallery);
router.get('/admin/categories', viewController.getCategoryPage);
router.post('/admin/newcategory', viewController.createCategory);
router.get('/admin/category/edit/:id', viewController.getCategoryEditPage);
router.patch('/admin/category/edit/:id', viewController.updateCategory);
router.get('/admin/category/delete/:id', viewController.getCategoryDeletePage);
router.delete('/admin/category/delete/:id', viewController.deleteCategory);
router.get('/admin/post/:slug/delete', viewController.getDeletePostPage);
router.delete('/admin/post/:slug/delete', viewController.deletePost);
router.get(
  '/admin/galleryimage/:id/delete',
  viewController.getDeleteGalleryImage
);
router.delete(
  '/admin/galleryimage/:id/delete',
  viewController.deleteGalleryImage
);

router.get(
  '/admin/galleryimage/:id/edit',
  viewController.getGalleryImageEditPage
);
router.patch('/admin/galleryimage/:id/edit', viewController.editImage);

module.exports = router;

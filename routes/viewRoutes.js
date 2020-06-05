const express = require('express');
//const postController = require('../controllers/postController');
//const adminController = require('../controllers/adminController');
//const galleryController = require('../controllers/galleryContoller');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getBlogHome);
router.get('/about', viewController.getAbout);
router.get('/gallery', viewController.getGalleryHome);
router.get('/gallery/test', viewController.getGalleryImage);
router.get('/gallery/categories', viewController.getGalleryCategories);
router.get('/admin', viewController.getAdminHome);
router.get('/admin/newpost', viewController.getCreatePostPage);
router.post('/admin/newpost', viewController.createPost);
router.get('/admin/editpost/:slug', viewController.getPostEditPage);
router.patch('/admin/editpost/:slug', viewController.updatePost);
router.get('/admin/uploadimage', viewController.getImageUploadPage);
module.exports = router;

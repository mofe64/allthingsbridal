const express = require('express');
const blogController = require('../controllers/postController');


const router = express.Router();
router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPost);
router.post('/newpost', blogController.createPost);
router.patch('/:id', blogController.updatePost);
router.delete('/:id', blogController.deletePost);


module.exports = router;
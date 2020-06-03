const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.get('/', postController.getBlogHome);

module.exports = router;

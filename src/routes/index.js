const express = require('express')

const homeController = require('../controllers/home.controller')
const imageController = require('../controllers/image.controller')
const upload = require('../config/multer')

const router = express.Router()

/* home */
router.get('/', homeController.index)

/* images */
router.get('/images/:img_id', imageController.index)
router.post('/images', upload.single('image'), imageController.create)
router.get('/images/:img_id/like', imageController.like)
router.post('/images/:img_id/comment', imageController.comment)
router.get('/images/:img_id/remove', imageController.remove)

module.exports = router
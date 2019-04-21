const express = require('express')

const homeController = require('../controllers/home.controller')
const imageController = require('../controllers/image.controller')
const upload = require('../config/multer')
const passport = require('../config/passport')
const { isAuth } = require('../config/helper')

const router = express.Router()

/* pages */
router.get('/', homeController.index)
router.get('/profile', isAuth, homeController.profile)

/* auth */
router.get('/signin', homeController.signin)
router.post('/signin', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
}))
router.get('/signup', homeController.signup)
router.post('/signup', homeController.newuser)

router.get('/logout', homeController.logout)

/* images */
router.get('/images/:img_id', isAuth, imageController.index)
router.post('/images', isAuth, upload.single('image'), imageController.create)
router.get('/images/:img_id/like', isAuth, imageController.like)
router.post('/images/:img_id/comment', isAuth, imageController.comment)
router.get('/images/:img_id/remove', isAuth, imageController.remove)

module.exports = router
const Image = require('../models/image.model')
const Stasts = require('../utils/stasts')
const User = require('../models/user.model')

let ctrl = {}

ctrl.index = async (req,res) => {

    let images = await Image.find().sort({created_at: -1}).limit(30)

    res.render('index', {images})
    
}

ctrl.profile = async (req,res) => {
    
    let userID = req.user._id
    let stasts = await Stasts(userID)

    let images = await Image.find({owner: req.user._id}).sort({created_at: -1})
    res.render('profile', {images, stasts})
    
}

ctrl.signin = async (req,res) => {
    
    res.render('signin')
     
}

ctrl.signup = async (req,res) => {
    
    res.render('signup')
     
 }

ctrl.newuser = async (req,res) => {
    
   let body = req.body

   let newUser = await new User({
       username: body.username,
       password: body.password,
       email: body.email,
   }).save()

   res.redirect('/signin')
    
}

ctrl.logout = async (req,res) => {
    
    req.logout()
    res.redirect('/')
    
}

module.exports = ctrl
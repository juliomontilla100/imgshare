const fs = require('fs-extra')
const cloudinary = require('../config/cloudinary')
const Image = require('../models/image.model')
const Comment = require('../models/comment.model')
const Like = require('../models/like.model')
const Stasts = require('../utils/stasts')

let ctrl = {}

ctrl.index = async (req,res) => {

    let stasts = await Stasts()

    let imgID = req.params.img_id
    let image = await Image.findById(imgID,).populate('comments')

    image.views = image.views + 1

    await image.save()

    res.render('image', {image, stasts})
    
}

ctrl.create = async (req,res) => {
    
    let file = req.file
    let body = req.body

    let uploadImage = await cloudinary.v2.uploader.upload(file.path)

    fs.unlinkSync(file.path)

    let newImage = await new Image({
        title: body.title,
        description: body.description,
        url: uploadImage.secure_url,
        cloud_id: uploadImage.public_id
    }).save()

    res.redirect('/images/' + newImage._id)

}

ctrl.like = async (req,res) => {

    let imageID = req.params.img_id

    let newLike = await new Like({
        like: true,
        image: imageID
    }).save()

    await Image.findByIdAndUpdate(
        imageID,
        { $addToSet: { likes: newLike._id } }
    )

    res.redirect('/images/' + imageID)
    
}

ctrl.comment = async (req,res) => {

    let comment = req.body.comment
    let imageID = req.params.img_id

    let newComment = await new Comment({
        comment: comment,
        image: imageID
    }).save()

    await Image.findByIdAndUpdate(
        imageID,
        { $addToSet: { comments: newComment } }
    )

    res.redirect('/images/' + imageID)
    
}

ctrl.remove = async (req,res) => {

    let imageID = req.params.img_id

    let deleteImg = await Image.findByIdAndRemove(imageID)
    
    await Comment.remove({image : imageID})
    await Like.remove({image : imageID})
    await cloudinary.v2.uploader.destroy(deleteImg.cloud_id)
    
    res.redirect('/')
    
}

module.exports = ctrl
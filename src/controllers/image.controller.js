const fs = require('fs-extra')
const cloudinary = require('../config/cloudinary')
const Image = require('../models/image.model')
const Comment = require('../models/comment.model')
const Like = require('../models/like.model')
const Stasts = require('../utils/stasts')
const { isValidID } = require('../config/helper')

let ctrl = {}

ctrl.index = async (req,res) => {

    let userID = req.user._id
    let stasts = await Stasts(userID)

    let imgID = req.params.img_id
    let image = await Image.findById(imgID).populate({
        path    : 'comments',
        populate: [
            { path: 'owner' }
        ]
    })

    if(!image){
        res.redirect('/')
        return
    }

    image.views = image.views + 1

    await image.save()
    
    let options = {
        can_delete : false,
        can_like: true
    }

    if(image.owner.equals(userID)){
        options.can_delete = true
    }

    for (let userLike of image.likes){

        if(userLike.equals(userID)){
            options.can_like = false
        }
        
    }

    res.render('image', {image, stasts, options})

}

ctrl.create = async (req,res) => {
    
    let file = req.file
    let body = req.body
    let userID = req.user._id

    let uploadImage = await cloudinary.v2.uploader.upload(file.path)

    fs.unlinkSync(file.path)

    let newImage = await new Image({
        title: body.title,
        description: body.description,
        url: uploadImage.secure_url,
        cloud_id: uploadImage.public_id,
        owner: userID
    }).save()

    res.redirect('/images/' + newImage._id)

}

ctrl.like = async (req,res) => {

    let imageID = req.params.img_id
    let userID = req.user._id

    let newLike = await new Like({
        like: true,
        image: imageID,
        owner: userID
    }).save()

    await Image.findByIdAndUpdate(
        imageID,
        { $addToSet: { likes: userID } }
    )

    res.redirect('/images/' + imageID)
    
}

ctrl.comment = async (req,res) => {

    let comment = req.body.comment
    let imageID = req.params.img_id
    let userID = req.user._id

    let newComment = await new Comment({
        comment: comment,
        image: imageID,
        owner: userID
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
    
    res.redirect('/profile')
    
}

module.exports = ctrl
const Comment = require('../models/comment.model')
const Image = require('../models/image.model')

let totalImages = async (userId) => {

    let imagesTotal = await Image.find({owner: userId}).countDocuments()
    return imagesTotal
}

let totalComments = async (userId) => {
    let commentsTotal = await Comment.find({owner: userId}).countDocuments()
    return commentsTotal
}

let totalLikes = async (userId) => {
    let result = await Image.aggregate(
        [
            { $match: { owner: userId } },
            { $project: {
                _id: 1,
                likesTotal: {$size: '$likes'}
            }},
            { $group: {
                _id: 1,
                likesTotal: {$sum: '$likesTotal'}
            }},
        ]
    )

    if(result.length > 0){
        return result[0].likesTotal
    }else{
        return 0
    }
    
}

let totalViews = async (userId) => {
    let result = await Image.aggregate(
        [
            { $match: { owner: userId } },
            { $group: {
                _id: 1,
                viewsTotal: {$sum: '$views'}
            }},
        ]
    )

    if(result.length > 0){
        return result[0].viewsTotal
    }else{
        return 0
    }

}

let popularImages = async (userId) => {
    let images = await Image.aggregate(
        [
            { $match: { owner: userId } },
            { $project: {
                title: 1,
                url: 1,
                populars: {$size: '$likes'}
            }},
            { $sort: { populars: -1 } },
            { $limit: 5 }
        ]
    )

    if(!images){
        return 0
    }

    return images
}

let recentComments = async (userId) => {

    let comments = await Comment.find().populate('image').populate('owner', '-password').sort({created_at: -1})

    let res = comments.filter( comment => comment.image.owner.equals(userId) )

    return res

}


module.exports = async (userId) => {

    let result = await Promise.all([
        totalViews(userId),
        totalLikes(userId),
        totalImages(userId),
        totalComments(userId),
        popularImages(userId),
        recentComments(userId)
    ])

    return {
        totalViews : result[0],
        totalLikes : result[1],
        totalImages : result[2],
        totalComments : result[3],
        popularImages : result[4],
        recentComments : result[5]
    }
    
}
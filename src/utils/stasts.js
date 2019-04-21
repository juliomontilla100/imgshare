const Comment = require('../models/comment.model')
const Image = require('../models/image.model')

let totalImages = async () => {
    let imagesTotal = await Image.count()
    return imagesTotal
}

let totalComments = async () => {
    let commentsTotal = await Comment.count()
    return commentsTotal
}

let totalLikes = async () => {
    let result = await Image.aggregate(
        [
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

let totalViews = async () => {
    let result = await Image.aggregate(
        [
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

let popularImages = async () => {
    let images = await Image.aggregate(
        [
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

let recentComments = async () => {
    let comments = await Comment.find().sort({created_at : -1}).limit(5).populate('image')

    if(!comments){
        return 0
    }
    
    return comments
}


module.exports = async () => {
    
    let result = await Promise.all([
        totalViews(),
        totalLikes(),
        totalImages(),
        totalComments(),
        popularImages(),
        recentComments()
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
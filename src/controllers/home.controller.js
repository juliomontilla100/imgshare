const Image = require('../models/image.model')
const Stasts = require('../utils/stasts')

let ctrl = {}

ctrl.index = async (req,res) => {
    
    let stasts = await Stasts()

    let images = await Image.find({}).sort({created_at: -1})
    res.render('index', {images, stasts})
    
}

module.exports = ctrl
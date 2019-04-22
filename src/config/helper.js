const moment = require('moment')
require('moment/locale/es')

const helpers = {}

helpers.timeago = timestamp => {
    moment.locale('es')
    return moment(timestamp).startOf('minute').fromNow()
}

helpers.isAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/signin");
    }
}

helpers.isValidID = (req,res,next) => {

    let imgID = req.params.img_id

    if (imgID.match(/^[0-9a-fA-F]{24}$/)) {
       next()
    }else{
        res.redirect('/')
    }
    
}

module.exports = helpers
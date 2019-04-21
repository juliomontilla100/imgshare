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

module.exports = helpers
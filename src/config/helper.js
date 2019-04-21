const moment = require('moment')
require('moment/locale/es')

const helpers = {}

helpers.timeago = timestamp => {
    moment.locale('es')
    return moment(timestamp).startOf('minute').fromNow()
}

module.exports = helpers
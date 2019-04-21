const path = require('path')
const mkdirp = require('mkdirp')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const dir = path.join(__dirname, '../public/upload/temp')
        mkdirp(dir, err => cb(err, dir))
        
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

module.exports = upload
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/imgshare', {useNewUrlParser: true})
    .then(res => console.log('DB connected'))
    .catch(err => console.log(err))
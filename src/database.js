const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://juliomontilla100:Maracaibo123.@cluster0-fazva.mongodb.net/test?retryWrites=true', {useNewUrlParser: true})
    .then(res => console.log('DB connected'))
    .catch(err => console.log(err))
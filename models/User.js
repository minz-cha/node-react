const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,  //space(띄어쓰기) 관리
        unique: 1 //같은 값이 들어갈 수 없도록 설정
    },
    password: {
        type: String,
        minlength: 8
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {  //토큰 유효기간
        type: Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports = { User }
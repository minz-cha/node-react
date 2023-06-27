const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

// 'save'동작 전에 이뤄짐
userSchema.pre('save', function (next) {
    var user = this;

    // isModified - mongoose 모듈 내장함수
    if (user.isModified('password')) {
        // 비밀번호 암호화 - Salt 이용
        bcrypt.genSalt(saltRounds, function (err, salt) {
            // 에러 경우 - save의 err 처리로 넘겨줌
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {

    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
        // if (plainPassword === this.password) {
        //     cb(null, isMatch);
        // } else {
        //     cb('password 불일치');
        // }
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    //jsonwebtoken을 이용해 토큰 생성
    var token = jwt.sign(user._id.toHexString(), "secretToken");
    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    });
};

const User = mongoose.model('User', userSchema)

module.exports = { User }
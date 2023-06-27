const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { User } = require('./models/User')
const mongoose = require('mongoose')

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
//application/json
app.use(bodyParser.json())
app.use(cookieParser())

const url = config.mongoURI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB에 연결되었습니다.')
        // 여기에 추가적인 작업이나 애플리케이션 실행 코드를 작성할 수 있음
    })
    .catch((error) => {
        console.error('MongoDB 연결에 실패했습니다.', error)
    })

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', async (req, res) => {
    const user = new User(req.body)

    const result = await user.save().then(() => {
        res.status(200).json({
            success: true
        })
    }).catch((err) => {
        res.json({ success: false, err })
    })
})

app.post('/login', async (req, res) => {

    // 요청된 이메일이 DB에 있는지 조회
    await User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.json({
                    loginSuccess: false,
                    message: "제공된 이메일에 해당하는 유저가 없습니다."
                })
            }
            // 해당 이메일이 있다면 비밀번호가 맞는지 확인
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch)
                    return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

                // 비밀번호 확인되면 토큰 생성
                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err)
                    //토큰 저장
                    res.cookie("user_auth", user.token)
                        .status(200)
                        .json({ loginSuccess: true, userId: user._id })
                })
            })
        })
        .catch((err) => {
            return res.status(400).send(err)
        })
    // const result = await user.save().then(() => {
    //     res.status(200).json({
    //         success: true
    //     })
    // }).catch((err) => {
    //     res.json({ success: false, err })
    // })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
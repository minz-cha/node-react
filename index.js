const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

const config = require('./config/key')
const { User } = require('./models/User')
const mongoose = require('mongoose')

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
//application/json
app.use(bodyParser.json())

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

app.post('/register', (req, res) => {
    // 회원가입할 때 필요한 정보들을 client에서 받고
    // 해당 값을 DB에 넣음

    const user = new User(req.body)

    user.save()
        .then((userInfo) => {
            return res.status(200).json({
                success: true
            });
        })
        .catch((err) => {
            return res.json({ success: false, err: err.message })
        })
})

app.post('/login', (req, res) => {

    // 요청된 이메일이 DB에 있는지 조회
    User.findOne({ email: req.body.email }, (err, user) => {
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
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
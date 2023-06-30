const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')
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
    //회원가입시 필요 정보를 client에서 가져오면
    //데이터베이스에 삽입한다

    //body parser를 통해 body에 담긴 정보를 가져온다
    const user = new User(req.body)

    //mongoDB 메서드, user모델에 저장
    const result = await user.save().then(() => {
        res.status(200).json({
            success: true
        })
    }).catch((err) => {
        res.json({ success: false, err })
    })
})

app.post('/login', async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        const isMatch = await user.comparePassword(req.body.password)
        console.log(isMatch)
        if (!isMatch) {
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
        }

        const token = await user.generateToken()
        res.cookie("user_auth", token).status(200).json({ loginSuccess: true, userId: user._id })
    } catch (err) {
        return res.status(400).send(err)
    }
})

// role 0: admin
// role 1: 일반 유저 
app.get('/auth', auth, (req, res) => {

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? true : false,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/logout', auth, async (req, res) => {
    try {
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { token: '' }
        )

        return res.status(200).send({
            success: true
        })
    } catch (err) {
        return res.json({ success: false, err })
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
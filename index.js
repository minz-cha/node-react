const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
var mongodb_pwd = require('./secret.json')

const url = `mongodb://ming:${mongodb_pwd.mongodb_pwd}@ac-tnjmlt2-shard-00-00.10bqcpc.mongodb.net:27017,ac-tnjmlt2-shard-00-01.10bqcpc.mongodb.net:27017,ac-tnjmlt2-shard-00-02.10bqcpc.mongodb.net:27017/?ssl=true&replicaSet=atlas-iuuepm-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB에 연결되었습니다.');
        // 여기에 추가적인 작업이나 애플리케이션 실행 코드를 작성할 수 있음
    })
    .catch((error) => {
        console.error('MongoDB 연결에 실패했습니다.', error);
    });

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
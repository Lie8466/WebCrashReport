const express = require('express');
const app = express();
const port = 5000;

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 4.17.1')
    if(req.method=="OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
    else  next();
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/save-data', (req, res) => {
  res.send({ok: true})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
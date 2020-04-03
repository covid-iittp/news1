var express = require('express')
var path = require('path')
var PORT = process.env.PORT || 6772
var bodyParser = require("body-parser")
var cors = require('cors')
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(cors({
      credentials: true,
  }))
  .get('/', (req, res) => {
    res.render('pages/index',{message:""})
    res.header('Acess-Control-Allow-Credentials','true')
    res.header('Access-Control-Allow-Origin', '*');
    })
  .post('/',(req, res) => {
    req.header('Access-Control-Allow-Origin', '*');
    console.log(req);
    var str = req.body.link;
    var DATE = new Date()
    var date1 = DATE.getDate()
    var month1 = DATE.getMonth() + 1
    var year1 = DATE.getFullYear()
    var prev = DATE
    prev.setDate(DATE.getDate() - 1)
    var date2 = prev.getDate()
    var month2 = prev.getMonth() + 1
    var year2 = prev.getFullYear()
    var today1 = year1+"-"+month1+"-"+date1
    var today2 = year2+"-"+month2+"-"+date2
    console.log(today1)
    console.log(today2)
    const NewsAPI = require('newsapi')
    const newsapi = new NewsAPI('c62e6d455d1d446db915a0e311ba787e')
    newsapi.v2.everything({
        catergory:['health','technology','science','nation'],
        language: 'en',
        sortBy:'relevancy',
        from:today1,
        to:today2,
        domains:'thehindubusinessline.com',
    
    }).then(response => {
        res.json({ message: response });
      });
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

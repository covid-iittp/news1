var express = require('express')
var path = require('path')
var PORT = process.env.PORT || 6772
var bodyParser = require("body-parser")
var cors = require('cors')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('old_db.db');
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
    prev.setDate(DATE.getDate() - 30)
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
        var newss = response
        var doop = newss.articles
        var c = 0
        db.serialize(function(){
          res.json({ message: response });
          db.run("CREATE TABLE record1 (author TEXT,  title TEXT, description TEXT, url TEXT, urlToImage TEXT, publishedAt TEXT)");
          var stmt = db.prepare("INSERT INTO record1 VALUES (?,?,?,?,?,?)");
            for(c=0;c<doop.length;c++)
              {
				  console.log(doop[c].title)
          if(doop[c].title.includes('Corona') || doop[c].title.includes('corona') || 
          doop[c].title.includes('Covid') || doop[c].title.includes('covid') || 
          doop[c].title.includes('COVID') || doop[c].title.includes('Flood risks') || 
          doop[c].title.includes('Virus') || doop[c].title.includes('virus'))
                {
					        stmt.run(doop[c].author,doop[c].title,doop[c].description,doop[c].url,doop[c].urlToImage,doop[c].publishedAt);
                }
              }
          stmt.finalize();
          db.each("SELECT title, publishedAt FROM record1",function(err,row){
            console.log("News: "+row.title,row.publishedAt);
          })
        })
        db.close()
      });  
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

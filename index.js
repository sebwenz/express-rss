let express = require('express');
let app = express();
let rss = require('rss-to-json');
let qs = require('querystring');

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"))
app.use(express.urlencoded());

app.get('/', (req, res) => {
    rss.load('http://www.maclife.de/rss/news.xml', function (err, rss) {
        res.render('index', { rss: rss.items });
        console.log(rss);
    });
});

app.post('/addFeed', (req, res) => {
    const feedLink = req.body.rssfeedlink;
    rss.load(feedLink, function (err, rss){
        res.render('index', {rss: rss.items});
        console.log(rss);
    });
});

app.listen(8080, () => {
    console.log('app listening on port 8080');
});



//https://rss.golem.de/rss.php?feed=RSS2.0
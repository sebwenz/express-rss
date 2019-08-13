let express = require('express');
let app = express();
let rss = require('rss-to-json');
let qs = require('querystring');
let MongoClient = require('mongodb').MongoClient;

let url = "mongodb://localhost:27017/feedDB";
let dbo;

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbo = db.db("feedDB");
    dbo.createCollection("feeds", function (err, res) {
        if (err) throw err;
    });
});

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"))
app.use(express.urlencoded());

app.get('/', (req, res) => {
    rss.load('http://www.maclife.de/rss/news.xml', function (err, rss) {
        res.render('index', { rss: rss.items });
        //console.log(rss);
    });
});

app.post('/addFeed', (req, res) => {
    const feedLink = req.body.rssfeedlink;
    const feedTag = req.body.feedName;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var feedObj = {
            url: feedLink,
            name: feedTag
        };
        dbo.collection("feeds").insertOne(feedObj, function (err, res) {
            if (err) throw err;
            console.log("link inserted");
        });
    });
    rss.load(feedLink, function (err, rss) {
        res.render('index', { rss: rss.items });
        //console.log(rss);
        dbo.collection("feeds").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    });
});


app.post('/feedOverview', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        dbo.collection("feeds").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.render('overview', { result: result });
        })
    })
})

app.post('/showfeed', (req, res) => {
    var feedLink = req.body.linktofeed;
    console.log(req.body.linktofeed);
    //console.log(req.body.name);
    rss.load(feedLink, function (err, rss) {
        res.render('index', { rss: rss.items });
        //console.log(rss);
    });
});

app.post('/deleteFeed', (req, res) => {
    var feedLink2 = req.body.linktofeed;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        dbo = db.db("feedDB");
        dbo.collection("feeds").deleteOne({url: feedLink2});
        console.log(feedLink2);
        dbo.collection("feeds").find({}).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result);
            res.render('overview', { result: result });
        })
    });
});

app.post('/removeDatabase', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        dbo = db.db("mydb");
        dbo.feeds.remove({});
    });
});

app.listen(8080, () => {
    console.log('app listening on port 8080');
});



//https://rss.golem.de/rss.php?feed=RSS2.0
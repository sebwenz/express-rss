let express = require('express');
let app = express();
let rss = require('rss-to-json');
let qs = require('querystring');

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"))

app.get('/', (req, res) => {
    rss.load('http://www.maclife.de/rss/news.xml', function (err, rss) {
        res.render('index', { rss: rss.items });
        console.log(rss);
    });
});


function loadFeed (request, response){
    if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post = qs.parse(body);
            rss.load(toString(post.rss-feed-link));
            response.render('index', {rss: rss.items})
            console.log(rss);
        });
    }
}

app.listen(8080, () => {
    console.log('app listening on port 8080');
});



//https://rss.golem.de/rss.php?feed=RSS2.0
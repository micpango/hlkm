var express = require ('express');
var logfmt = require('logfmt');

var app = express();
var serveStatic = require('serve-static');

var Gisty = require('gisty');
var gist = new Gisty({
	username: 'micpango'
});

app.use(logfmt.requestLogger());
app.use(serveStatic(__dirname + '/public'));

app.set('views', __dirname + '/public/views');
app.set('view engine', 'html');
app.engine('html', require('hogan-express'));

app.get('/', function (req, res, next) {
	gist.fetch('88d99020ba186c05692d', function (error, gist) {
		console.log('DEBUG : ' + JSON.stringify(gist.files['hlkm15_test.json'].content)); // TODO michael: remove
	});
	//res.json()
    res.render('index');
});

var port = Number(process.env.PORT || 3000)
app.listen(port, function () {
	console.log('Listening on port %d', port);
});

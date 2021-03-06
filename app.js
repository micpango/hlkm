var express = require ('express');
var logfmt = require('logfmt');

var Promise = require('bluebird');

var app = express();
var serveStatic = require('serve-static');

var Gisty = require('gisty');
var gist = Promise.promisifyAll(new Gisty({
	username: 'micpango'
}));

var rules = require('./src/rules.js');

app.use(logfmt.requestLogger());
app.use(serveStatic(__dirname + '/public'));

app.set('views', __dirname + '/public/views');
app.set('view engine', 'html');
app.engine('html', require('hogan-express'));

app.get('/', function (req, res, next) {
	gist.fetchAsync('565d6351635d2e755fa4').then(function (gist) {
		var data = JSON.parse(gist.files['hlkm15.json'].content);
		rules.calculateTempo(data)
		.then(rules.calculateRoad)
		.then(rules.calculateGC)
		.then(function (result) {
			res.render('index', { result: result });
		});
	});
});

var port = Number(process.env.PORT || 3000)
app.listen(port, function () {
	console.log('Listening on port %d', port);
});

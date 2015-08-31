var express = require ('express');
var logfmt = require('logfmt');

var app = express();
var serveStatic = require('serve-static');

app.use(logfmt.requestLogger());
app.use(serveStatic(__dirname + '/public'));

app.set('views', __dirname + '/public/views');
app.set('view engine', 'html');
app.engine('html', require('hogan-express'));

app.get('/', function (req, res, next) {
    res.send('HL!');
});

var port = Number(process.env.PORT || 3000)
app.listen(port, function () {
	console.log('Listening on port %d', port);
});

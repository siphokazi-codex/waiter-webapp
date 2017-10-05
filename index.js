const express = require('express');
const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');
const WaitersBoard = require('./waiters');
const Models = require('./models');

const flash = require('express-flash');

const session = require('express-session');
const app = express();

const mongoURL = process.env.MONGO_DB_URL || 'mongodb://localhost/waiter';

const models = Models(mongoURL);

const waitersBoard = WaitersBoard(models);

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 * 30 }}));
app.use(flash());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Including your public folder, to have access of the contents in there.
app.use(express.static('public'))

// parse application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

// create application/json parser
app.use(bodyParser.json())

// app.get('/', function(req, res){
//  res.redirect('/waiters')
// });
//
 app.get('/waiters/admin', waitersBoard.getWaiter);
 app.get('/waiters/:username', waitersBoard.getForm);

 app.post('/waiters/:username', waitersBoard.add);

 app.post('/reset', waitersBoard.resetFields);

//start the server
var server = app.listen(process.env.PORT || 3000, function () {

 var host = server.address().address;
 var port = server.address().port;

 console.log('Example app listening at http://%s:%s', host, port);

});

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Outbound Calling Details
var http = require('http');
var twilio = require('twilio');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

//Twilio Code
// Handle the form POST to place a call
app.post('/call', function(request, response) {
    var client = twilio();
    client.makeCall({
        // make a call to this number
        to:request.body.number,

        // Change to a Twilio number you bought - see:
        // https://www.twilio.com/user/account/phone-numbers/incoming
        from:'+13072985751',

        // A URL in our app which generates TwiML
        // Change "CHANGE_ME" to your app's name
        url:'https://callme2.azurewebsites.net/outbound_call'
    }, function(error, data) {
        // Go back to the home page
        response.redirect('/');
    });
});

// Generate TwiML to handle an outbound call
app.post('/outbound_call', function(request, response) {
    var twiml = new twilio.TwimlResponse();

    // Say a message to the call's receiver
    twiml.say('hello - thanks for checking out Twilio and Azure', {
        voice:'woman'
    });

    response.set('Content-Type', 'text/xml');
    response.send(twiml.toString());
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

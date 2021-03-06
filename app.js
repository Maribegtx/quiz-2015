var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials= require('express-partials');
var methodOverride= require('method-override');
var session= require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(partials());

//Auto logout
app.use(function(req, res, next){
    var tPermitido = 60*1000*2;//Tiempo permitido en milisegundos
    var hInicio = new Date().getTime();//Hora de inicio de la sesión

    if(req.session && req.session.lastAccess) {
    var tSesion = hInicio - req.session.lastAccess;//Tiempo transcurrido entre el inicio de sesión y el último acceso
        if (tPermitido <= tSesion){
        req.session.errors = [{"message": 'Su sesión ha caducado. Debe volver a identificarse. '}];
        delete req.session.user;
        //res.redirect('/login');
        }
    }
    req.session.lastAccess = hInicio;
    next(); 
});



// Helpers dinámicos
app.use(function(req, res, next) {

// Guardar path en session.redir para después de login
if(!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
}


// Hacer visible req.session en las vistas
    res.locals.session = req.session;
   next();
});
app.use('/', routes);

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
      error: err,
      errors:[]
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors:[]
  });
});


module.exports = app;

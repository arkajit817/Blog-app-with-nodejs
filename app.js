var express = require("express");
var path = require("path");
var favicon = require ('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var session = require('express-session');

var bodyParser = require("body-parser");
var mongo = require('mongodb');
var db = require('monk')('localhost:27017/nodeblog');

var multer = require('multer');
var flash = require('connect-flash');
var routes = require('./routes/index');
var posts = require('./routes/posts');
var users = require('./routes/users');

var app = express();

app.locals.moment = require('moment');

app.use(multer({ dest: './public/images/uploads'}).any());


app.set('views', path.join(__dirname,'views' ));
app.set('view engine', 'jade');




app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
	secret : 'secret',
	saveUninitialized : true,
	resave : true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
	errorFormatter : function(param,msg,value){
		var namespace = param.split('.')
		,root = namespace.shift()
		,formParam = root;

		while(namespace.length){
			formParam += '['+
			namespace.shift()+ ']';
		}
		return {
			param : formParam,
			msg : msg,
			value : value
		}
	}
}));






app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function(req,res,next){
	res.locals.messages = require('express-messages')(req,res);
	next();
});

app.use(function(req,res,next){
	req.db = db;
	next();
})


app.use('/', routes);
app.use('/users', users)
app.use('/posts',posts);

app.use(function(req,res,next){
	var err = new Error('not found');
	err.status = 404;
	next(err);

})


app.listen(7777,function(){
    console.log("Started listening on port", 7777);
})

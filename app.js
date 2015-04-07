
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/index',routes.index);

app.get('/courseManagement',checkManagerLogin);
app.get('/courseManagement',routes.findAllCourses);
app.post('/courseManagement/createOneCourse',routes.createOneCourse);
app.delete('/courseManagement/delCourse',routes.delOneCourse);
app.put('/courseManagement/updateCourse',routes.updateCourse);

app.get('/courseRegist',checkUserLogin);
app.get('/courseRegist',routes.courseRegist);
app.put('/courseRegist/cancel',routes.cancelRegistedCourse);
app.put('/courseRegist/regist',routes.registOneCourse);

app.get('/user/:username',function(req,res){
    res.send('user:'+req.params.username);
});
app.post('/user/regist',routes.userRegist);
app.post('/user/login',routes.userLogin);
app.post('/user/exitLogin',function(req,res){
    req.session.destroy();
    res.redirect('/index');
});
app.put('/user/modifyPassword',routes.modifyPassword);
app.get('/myContent',routes.myContent);

app.get('/userManagement',checkManagerLogin);
app.get('/userManagement',routes.findAllUsers);
app.put('/userManagement/authOneUser',routes.authOneUser);
app.delete('/userManagement/delOneUser',routes.delOneUser);

mongoose.connect('mongodb://localhost:27000/mynode');
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function checkManagerLogin(req,res,next){
    if(!req.session.loggedIn){
        res.redirect('/index');
    }else if(req.session.role == '0'){
        res.redirect('/courseRegist');
    }else{
        next();
    }
}

function checkUserLogin(req,res,next){
    if(!req.session.loggedIn){
        res.redirect('/index');
    }else if(req.session.role == '1'){
        res.redirect('/courseManagement');
    }else{
        next();
    }
}
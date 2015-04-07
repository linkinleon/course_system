
/*
 * GET home page.
 */
var userModel = require('../model/userModel');
var User = userModel.UserModel;

var courseModel = require('../model/courseModel');
var Course = courseModel.CourseModel;

exports.index = function(req, res, next){
  res.render('index', { userName: req.session.userName,userRole: req.session.role});
};

exports.findAllCourses = function(req,res){
    Course.find(function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('courseManagement',{allCourses : result});
        }
    });
}
exports.delOneCourse = function(req,res){
    var courseId = req.query.id;
    Course.remove({'_id': courseId}, function(err,result){
        if(err){
            console.log(err);
        }
        if(result === 1){
            res.send({delCourseSuccess : "del success!"});
        }
    });
}
exports.updateCourse = function(req,res){
    var courseId = req.query.id;
    var course_title = req.body.courseTitle;
    var course_teacher = req.body.teacher;
    var course_courseTime = req.body.courseTime;
    var course_totalCount = req.body.totalCount;
    var course_content = req.body.courseContent;
    var updateData = {$set:{courseName : course_title,
                            teacherName : course_teacher,
                            courseTime : course_courseTime,
                            totalRestCount : course_totalCount,
                            courseDetail : course_content}}
    Course.update({_id:courseId},updateData,function(err,result){
        if(err){
            console.log(err);
        }
        if(result === 1){
            res.send({success : 'modify successful'});
        }
    });
}
exports.createOneCourse = function(req, res){
    var course_title = req.body.courseTitle;
    var course_teacher = req.body.teacher;
    var course_time = req.body.courseTime;
    var course_count = req.body.totalCount;
    var course_content = req.body.courseContent;
    var course = new Course({
        courseName : course_title,
        teacherName : course_teacher,
        courseTime : course_time,
        totalRestCount : course_count,
        courseDetail : course_content
    });
    course.save(function(err,result){
        if(err){
           console.log(err);
        }else{
           res.send({'success' : 'add successful!','rowId' : result._id});
        }
    });
};

exports.courseRegist = function(req, res){
    var allShowCourses = [];
    var userCourses = [];
    var registedCourses = [];
    var userId = req.session.loggedIn;
    Course.find(function(err,result){
        if(err){
            console.log(err);
        }else {
            for(var i=0;i<result.length;i++){
                if(result[i].totalRestCount>0){
                    allShowCourses.push(result[i]);
                }
            }
        }
        User.findOne({'_id':userId},function(err,result){
            if(err){
                console.log(err);
            }else{
                var myResult = result.course;
                for(var i=0;i<myResult.length;i++){
                    userCourses.push(myResult[i]);
                }
                for(var j=0;j<allShowCourses.length;j++){
                    for(var k=0;k<userCourses.length;k++){
                        if(userCourses[k] == allShowCourses[j]._id){
                            registedCourses.push(allShowCourses[j]);
                            break;
                        }
                    }
                }
            }
            res.render('courseRegist',{'myRegistedCourses':registedCourses,'myShowCourses':allShowCourses});
        });
    });
};

exports.cancelRegistedCourse = function(req,res){
    var userId = req.session.loggedIn;
    var courseId = req.query.courseId;
    var updateData = {$pull:{course : courseId}};
    User.update({_id:userId},updateData,function(err,result){
        if(err){
            console.log(err);
        }
        if(result === 1){
            var secondUpdateData = {$inc:{totalRestCount : 1 }};
            Course.update({_id:courseId},secondUpdateData,function(err,result){
                if(err){
                    console.log(err);
                }
                if(result === 1){
                    res.send({success : 'cancel course successful'});
                }
            });
        }
    });
}

exports.registOneCourse = function(req,res){
    var userId = req.session.loggedIn;
    var courseId = req.query.courseId;
    Course.findOne({_id:courseId},function(err,result){
        if(result.totalRestCount > 0){
            var currentCount = result.totalRestCount;
            var updateData = {$push:{course : courseId}};
            User.update({_id:userId},updateData,function(err,result){
                if(err){
                    console.log(err);
                }
                if(result === 1){
                    var presentCount = currentCount-1;
                    var secondUpdateData = {$set:{totalRestCount : presentCount}}
                    Course.update({_id : courseId},secondUpdateData,function(err,result){
                        if(err){
                            console.log(err);
                        }
                        if(result === 1){
                            res.send({success : 'regist success'});
                        }
                    });
                }
            });
        }
        if(result.totalRestCount == 0){
            res.send({error : 'no rest courses'});
        }
    });
}

exports.userRegist = function(req,res){
    var user_name = req.body.username;
    var user_pass = req.body.password;
    var user_email = req.body.email;
    var user = new User({
        username : user_name,
        password : user_pass,
        email : user_email,
        course : []
    });
    user.save(function (err){
        if(err){
            console.log(err);
        }
        res.redirect('/index');
    });
};

exports.userLogin = function(req,res){
    var user_name = req.body.username;
    var user_pass = req.body.password;
    User.findOne({username : user_name,password : user_pass},function(err,doc){
        if(err){
            console.log(err);
        }
        if(!doc){
            res.send({'error' : 'not found'});
        }else{
            req.session.loggedIn = doc._id.toString();
            req.session.role = doc.role.toString();
            req.session.userName = doc.username.toString();
            res.send({'userId' : doc._id,'username' : doc.username,'role' : doc.role});
        }
    });
};

exports.findAllUsers = function(req,res){
    var userId = req.session.loggedIn;
    User.find(function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('userManagement',{allUsers : result,currentUserId : userId});
        }
    });
}

exports.authOneUser = function(req,res){
    var userId = req.query.id;
    var updateRole = req.query.role;
    var updateData = {$set:{role : updateRole}};
    User.update({_id:userId},updateData,function(err,result){
        if(err){
            console.log(err);
        }
        if(result === 1){
            res.send({authUserSuccess : "authorize success!"});
        }
    });
}

exports.delOneUser = function(req,res){
    var userId = req.query.id;
    User.remove({'_id': userId}, function(err,result){
        if(err){
            console.log(err);
        }
        if(result === 1){
            res.send({delUserSuccess : "del success!"});
        }
    });
}

exports.myContent = function(req,res){
    var userId = req.session.loggedIn;
    User.findOne({'_id': userId}, function(err,result){
        if(err){
            console.log(err);
        }
        if(result){
            var registedCourseCount = result.course.length;
            var username = result.username;
            var email = result.email;
            Course.find(function(err,result){
                if(err){
                    console.log(err);
                }
                if(result){
                    var totalCourseCount = result.length;
                    var courseNames = [];
                    var courseRestCount = [];
                    var courseTime = [];
                    for(var i=0;i<result.length;i++){
                        var courseNameString = '"'+result[i].courseName.toString()+'"';
                        courseNames.push(courseNameString);
                        courseRestCount.push(result[i].totalRestCount);
                        courseTime.push(result[i].courseTime);
                    }
                    var courseNameString = courseNames.join(',');
                    var restCourseCount = totalCourseCount-registedCourseCount;
                    res.render('myContent',{myUserName : username,myEmail : email,courseNameSet : courseNameString,
                        courseRestCountSet : courseRestCount,myCourseCount : registedCourseCount,
                        myCourseTime : courseTime,totalCount:restCourseCount});
                }
            });
        }
    });
}

exports.modifyPassword = function(req,res){
    var userName = req.body.modifyUser;
    var oldPassword = req.body.oldPass;
    var newPassword = req.body.newPass;
    User.find({username : userName,password : oldPassword}, function(err,result){
        if(err){
            console.log(err);
        }
        if(result.length == 0){
            res.send({modifyPassError : 'modify password failed'});
        }
        if(result){
            var updateData = {
                password : newPassword
            }
            User.update({username : userName,password : oldPassword},updateData,function(err,result){
                if(err){
                    console.log(err);
                }
                if(result === 1){
                    res.send({modifyPassSuccess : "modify password success!"});
                }
            });
        }
    });
}
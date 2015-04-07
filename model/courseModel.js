/**
 * Created by Administrator on 14-4-20.
 */
var mymongoose = require('mongoose'),
    Schema = mymongoose.Schema,
    ObjectId = Schema.ObjectId;

var CourseSchema = new Schema({
    courseName : String,
    teacherName : String,
    courseDetail : String,
    courseTime : Number,
    totalRestCount : Number
});
exports.CourseModel = mymongoose.model('Course',CourseSchema);
/**
 * Created by Administrator on 14-4-12.
 */
var mymongoose = require('mongoose'),
    Schema = mymongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    username : String,
    password : String,
    email : String,
    role : {type:Number, default:0},
    course : [String]
});
exports.UserModel = mymongoose.model('User',UserSchema);

const mongoose = require('mongoose');
const {schema} = require('./yupvalidation');

const userschema = new mongoose.Schema({
   
   fullname: {
       type:String,
       required: true,
       minlenght:4,
   },
    email :{
        type: String,
        required: true,
        trim:true ,
        unique: true
    },
    password:{
        type : String,
        required :true,
        maxlenght:255,
        minlenght:4,
    },
  
})




userschema.statics.uservalidation = function(body){
    return schema.validate(body , {abortEarly: false});
}


const user = mongoose.model("user" ,userschema);


module.exports = user;
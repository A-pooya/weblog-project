const mongoose = require('mongoose');
const {yupofblog} = require('./blogvalidation');



const postschema = new mongoose.Schema({
    title: {
        type: String,
        required: true , 
        maxlength: 100,
        minlength: 5,
        trim: true,
    },
    body: {
        type:String,
        required: true,
    },
    status: {
        type: String,
        default:"general",
        enum :["general","private"]
    },
    thumbnail: {
        type : String
    },
    createdAt: {
        type: Date,
        default:Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
});

postschema.statics.blogvalidation = function(body){
    return yupofblog.validate(body,{abortEarly:false})
};

const Blogmodel =  mongoose.model("Blog", postschema);

module.exports = Blogmodel
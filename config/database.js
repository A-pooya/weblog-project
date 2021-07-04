const mongoose = require('mongoose');

const mongodb = async () => {
try{const conn = await mongoose.connect(process.env.MONGOURI,{
    useNewUrlParser:true , 
    useUnifiedTopology: true ,
    useFindAndModify :true,
});
console.log(`mongodb connected: ${conn.connection.host}`);
}
catch(err){console.log(err);
process.exit(1);}

}


module.exports = mongodb;

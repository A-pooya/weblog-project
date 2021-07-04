const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ejslayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fileupload = require('express-fileupload');

const path = require('path');
const app = express();
//*parse body
const bodyParser = require('body-parser');



//*bodyparser
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//*strategy
require('./config/passport');

//*dotenv
dotenv.config({path:'./config/configure.env'});

//*database 
const mongo = require('./config/database');



//*require routes
const logginroute = require('./routes/loggin');
const register = require('./routes/registerroute');
const mainpage = require('./routes/mainpageroute');
const dashboardpage = require('./routes/dashboardroute');



//!database connection
mongo();
//!end of database connection

//! statics
app.use(express.static(path.join(__dirname , "public")));
//! end of statics

//* fileupload
app.use(fileupload())

//! EJS ENGINE
app.use(ejslayout)
app.set("view engine" , "ejs");
app.set("layout" , "./layouts/logginlayout")
app.set("views" , "view");
//!end of ejs 

//*sessions
app.use(session({
    secret: process.env.SECRET,
    cookie:{maxAge: null},
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({
        mongoUrl:process.env.MONGOURI,
        dbName:"sessions"    
    })
}));
//*passport
app.use(passport.initialize());
app.use(passport.session());
//*flash
app.use(flash())

//?routes
app.use(logginroute);
app.use(register);
app.use('/' , mainpage);
app.use(dashboardpage);


//*404 page
app.use((req , res) =>{
    res.render("404",{pagetitle:"404 page",path:"/404", })
})





app.listen(3000 , console.log(`server is runnig on port ${3000}`));

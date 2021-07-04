const user = require("../model/db");
const bcrypt = require('bcryptjs');
const passport = require("passport");
const fetch = require('node-fetch');

const errors = [];

exports.logginpage = (req ,res) => {
    
    res.render("loggin" , {
        pagetitle: "loggin page",
        path:"/loggin",
        message: req.flash("success"),
        message: req.flash("signin"),
        error: req.flash("error")
        
    });
}

exports.handlelogin = async(req ,res ,next) =>{
    console.log(req.body["g-recaptcha-response"]);
    if(!req.body["g-recaptcha-response"]){
    req.flash("error","recaptcha validation is mandatory");
    return res.redirect('/loggin');
}
const secretkey = process.env.RECAPTCHA;
const verifyurl = `https://google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${req.body["g-recaptcha-response"]}
&remoteip=${req.connection.remoteAddress}`;
const response = await fetch(verifyurl,{
    method : "POST",
    Headers :{
        Accept: 'application/json',
    "Content-type":"application/x-www-form-urlencoded; charset=utf-8"}
})
const json = await response.json();
console.log(json);

if(json.success){
    passport.authenticate("local",{
        failureRedirect:"/loggin",
        failureFlash:true,
        // successRedirect:"/"
    })(req ,res ,next);
}else{req.flash("error", "there is a problem in recaptcha validation");
res.redirect("/loggin");
}
}

exports.rememberme = (req , res) => {
    if(req.body.remember){
        req.session.cookie.originalMaxAge = 24*60*60*1000
    }
    else{req.session.cookie.expires = null}
    res.redirect("/dashboard");
}




exports.registerpage = (req ,res) => {
    res.render("register",{
        pagetitle:'register page',
        path: "/register"
    })
}

exports.createuser =  async (req,res)=>{
    try {
        await user.uservalidation(req.body);
        const{fullname,password,email} = req.body;
        const useremail = await user.findOne({email});
        if(useremail){
            errors.push({message:"this email have been registered before"});
            return res.render("register",{
                pagetitle:'register page',
                path: "/register",
                errors});
        }
        const hash = await bcrypt.hash(password , 10)
        await user.create({
            fullname,
            email,
            password:hash,
        });
        req.flash("success","thank you for your register");
        res.redirect("/loggin");
        
    } catch (err) {
        
        console.log(err);
        
        err.inner.forEach((e)=> { 
            errors.push({
                name:e.path,
                message:e.message,
            });
            console.log(errors);
        });
        return res.render("register",{
            pagetitle:'register page',
            path: "/register",
            errors})
        
    }
}








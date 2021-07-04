exports.auth = (req , res ,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("signin","please sign in first")
    res.redirect('/loggin');
}
const fs =require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Blog = require('../model/blogs');
const shortid = require('shortid');
const rootdir = require('app-root-path');
const {filefilter} = require('../utils/multersetting');

//!smooth scrolling

exports.getdashboard = async (req , res) => {
    const page = +req.query.page || 1;
    const postperpage = 3 ;


    try{
        const numberofposts = await Blog.find({user:req.user.id}).countDocuments();
        const blogs = await Blog.find({user:req.user.id}).skip((page-1)*postperpage).limit(postperpage)
    res.render("private/blogs",{
        pagetitle:"your profile",
        path:"/dashboard",
        fullname: req.user.fullname,
        layout:"./layouts/dashlayout.ejs",
        blogs,
        currentpage: page,
        nextpage:page+1,
        previouspage : page-1,
        hasnextpage: postperpage * page < numberofposts,
        haspreviouspage: page > 1,
        lastpage:Math.ceil(numberofposts / postperpage),
    })}
    catch(err){
        console.log(err);
    }
}

exports.getaddpost = (req, res) => {
    res.render("private/addPost",{
        pagetitle:"create your new post",
        path:"/dashboard/add-post",
        layout:"./layouts/dashlayout",
        fullname: req.user.fullname,
    });
}

exports.geteditpost = async(req , res) => {
    const post = await Blog.findOne({_id : req.params.id});
    
    if(!post){
        
        return res.redirect("/404");
    }
    if(post.user.toString() != req.user.id){
        res.redirect("/dashboard");
    }else{
    res.render('private/editpost' , {
            pagetitle:"edit your post",
            path:"/dashboard/edit-post",
            layout:"./layouts/dashlayout",
            fullname: req.user.fullname,
            post,
        })
    }
}


exports.createpost = async (req , res) => {
    errorArr=[];
    
    if(req.files){
        const thumbnail = req.files.thumbnail ;
        const filename = `${shortid.generate()}_${thumbnail.name}`
        const filesave = `${rootdir}/public/uploads/thumbnails/${filename}`
        
    try {
        req.body = {... req.body , thumbnail}
        await Blog.blogvalidation(req.body);
        await sharp(thumbnail.data).jpeg({quality:80}).png({quality:80})
        .toFile(filesave)
        .catch((err) =>{console.log(err);})
        await Blog.create({...req.body , user: req.user.id , thumbnail:filename});
        res.redirect("/dashboard");
        
        
    } catch (err) {
        console.log(err);
        err.inner.forEach((e)=> { 
            errorArr.push({
                name:e.path,
                message:e.message,
            });
            
        });
        return res.render("private/addPost",{
            pagetitle:'create your new Post',
            path: "/dashboard/add-post",
            layout:"./layouts/dashlayout",
            fullname: req.user.fullname,
            errors:errorArr,
        });
    }  
    }else{
        try {
            req.body = {... req.body }
            await Blog.blogvalidation(req.body);
            await Blog.create({...req.body , user: req.user.id });
            res.redirect("/dashboard");

        } catch (err) {
            console.log(err);
            err.inner.forEach((e)=> { 
                errorArr.push({
                name:e.path,
                message:e.message,
        });
            console.log(errorArr);
        });
            return res.render("private/addPost",{
                pagetitle:'create your new Post',
                path: "/dashboard/add-post",
                layout:"./layouts/dashlayout",
            fullname: req.user.fullname,
                errors:errorArr,
            });
    }  

    }
}


exports.createeditpost = async (req ,res) => {
    errorArr=[];
    const thumbnail = req.files.thumbnail 
        const filename = `${shortid.generate()}_${thumbnail.name}`
        const filesave = `${rootdir}/public/uploads/thumbnails/${filename}`
        

    const post = await Blog.findOne({_id : req.params.id});
    
    try {
        if(thumbnail.name)
        await Blog.blogvalidation({... req.body , thumbnail});
        else await Blog.blogvalidation({... req.body , thumbnail:{name:"image",mimetype:"image/jpeg",size:0}})
        res.redirect("/dashboard");
        if(!post){
            return res.redirect("/404");
        }
        if(post.user.toString() != req.user.id){
            res.redirect("/dashboard");
        }else{
            if(thumbnail.name){
                 fs.unlink(`${rootdir}/public/uploads/thumbnails/${post.thumbnail}`, async(err)=>{
                if(err) {console.log(err)}
                else{
                    await sharp(thumbnail.data).jpeg({quality:80}).png({quality:80})
                    .toFile(filesave)
                    .catch((err) =>{console.log(err);})
                }
                })
            }
            
            
                 

        const {title,body,status} = req.body;
        post.title = title ; 
        post.status = status ; 
        post.body = body ;
        post.thumbnail = thumbnail.name ? filename : post.thumbnail;

        await post.save();
        res.redirect('/dashboard')
    }
    }catch (err) {
        console.log(err);
        err.inner.forEach((e)=> { 
            errorArr.push({
                name:e.path,
                message:e.message,
            });
            
        });
        return res.render("private/editPost",{
            pagetitle:'edit your Post',
            path: "/dashboard/edit-post",
            layout:"./layouts/dashlayout",
            fullname: req.user.fullname,
            post,
            errors:errorArr,
        });
        
    }
}

exports.deletepost = async(req , res) => {
    const post = await Blog.findOne({_id : req.params.id});
    try{
        if(post.user.toString() === req.user.id){
    const result = await Blog.findByIdAndRemove({_id : req.params.id})
    //console.log(result);
    return res.redirect('/dashboard')}
    }catch(err){
        console.log(err);
    }
}


exports.uploadImage = (req ,res) => {
    const upload = multer({
        limits:{fileSize:4000000} ,
        // dest:"uploads/",
        // storage: storage,
        fileFilter:filefilter,
    }).single("image")

    upload(req , res ,async(err) => {
        if(err){
            if(err.code === 'LIMIT_FILE_SIZE'){
              return res.status(400).send("file size must be less than 4 mb")
            }
            res.status(400).send(err);
        }else{
            if(req.file){
                const fullname = `${shortid.generate()}_${req.file.originalname}`
                await sharp(req.file.buffer).jpeg(
                    {quality:50}).png({quality:50})
                    .toFile(`./public/uploads/${fullname}`)
                    .catch((err) =>console.log(err))

                res.status(200).send(`http://localhost:3000/uploads/${fullname}`); //* i could send data in json format 
            }else{                                                   //* and use res.json({"message":" " , "address:" "}) instead res.send()
                res.send("choose your image first");
            }
        }
    });
}
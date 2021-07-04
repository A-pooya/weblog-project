const Blog = require('../model/blogs');
const {truncate} = require('../utils/truncate');

exports.getpublicposts = async(req , res) => {
    const page = +req.query.page || 1;
    const postperpage = 5 ;

    try {const numberofposts = await Blog.find({status:"general"}).countDocuments();
        const publicpost = await Blog.find({status: "general"}).sort({createdAt : "desc"})
        .skip((page-1)*postperpage).limit(postperpage)

         res.render('private/publicposts',{
             pagetitle: 'posts',
             path:"/public-posts",
             publicpost,
             truncate,
             currentpage: page,
             nextpage:page+1,
             previouspage : page-1,
             hasnextpage: postperpage * page < numberofposts,
             haspreviouspage: page > 1,
             lastpage:Math.ceil(numberofposts / postperpage),
         })

        
    } catch (err) {
        console.log(err);
    }
}


exports.publicpost = async(req ,res) => {
    try {
        const choosenpost = await Blog.findOne({_id:req.params.id}).populate("user");
         res.render('private/posts',{
             pagetitle: choosenpost.title,
             path:"/post",
             choosenpost,
         })

        
    } catch (err) {
        console.log(err);
        
    }
}

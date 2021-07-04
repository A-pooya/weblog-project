const {Router} = require('express');
const { auth} = require('../middlewares/auth');
const {getpublicposts,publicpost} = require('../controller/publicpostcontroller');
const router = new Router();



router.get('/', (req, res) => {
    res.render( 'mainpage', { 
        pagetitle: "write everything you want..."
        , path:"/"});
   
});


router.get("/public-posts",getpublicposts);

router.get("/post/:id",auth,publicpost);





module.exports = router;
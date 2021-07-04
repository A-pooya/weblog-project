const {Router} = require('express');

const { auth} = require('../middlewares/auth');
const {getdashboard,getaddpost,createpost,uploadImage,geteditpost,createeditpost,deletepost} = require('../controller/admincontroller');



const router = new Router();

router.get('/dashboard',auth,getdashboard);

router.get('/dashboard/add-post',auth, getaddpost);

router.get('/dashboard/edit-post/:id', auth , geteditpost);

router.get('/dashboard/delete-post/:id', auth , deletepost);

router.post('/dashboard/add-post',auth, createpost);

router.post('/dashboard/edit-post/:id', auth , createeditpost);

router.post('/dashboard/image-upload',auth,uploadImage);





module.exports = router;
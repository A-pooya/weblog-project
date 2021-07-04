const {Router} = require('express');
const {logginpage,handlelogin, rememberme} = require('../controller/usercontrol');


const router = new Router();

router.get('/loggin', logginpage);

router.post("/loggin", handlelogin, rememberme);


module.exports = router;
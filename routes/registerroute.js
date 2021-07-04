
 

const {createuser , registerpage} =  require('../controller/usercontrol');
const {Router} = require('express');

const router = new Router();


router.get("/register", registerpage)

router.post("/register" ,createuser)
    


module.exports = router;
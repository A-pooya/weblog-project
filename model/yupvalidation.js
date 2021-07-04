const yup = require('yup');


exports.schema = yup.object().shape({
    fullname: yup.string().required("please fill the fullname").min(4,"full name shoud not be less than 4 character"),
    email : yup.string().email("please check your email").required("email feild shoud not be empty"),
    password: yup.string().required("password is copulsory").min(4,"password must be more than 4 character").max(255),
    confirmpassword: yup.string().oneOf([yup.ref("password"),null],"passwords are not same"),
})


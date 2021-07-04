const yup = require('yup');

exports.yupofblog = yup.object().shape({
    title:yup.string("please check your title").required("your title shold not be empty").min(5,"your title must be more than 5 character").max(100 , "your title must br less than 100 character"),
    body:yup.string().required("you did not add any thing yet"),
    status:yup.mixed().oneOf(["private","general"],"pick one of general or private condition"),
thumbnail :yup.object().shape({
    name:yup.string().optional(),
    mimetype:yup.mixed().oneOf(["image/jpeg","image/png"],'your image must have one of png or jpg format'),
    size: yup.number().max(2000000,"your image size must be less than 2MB"),
})
})

document.getElementById("imageupload").onclick = function () {
    let request = new XMLHttpRequest(); 

    const selectedImage = document.getElementById("selectedimage");
    const imageStatus = document.getElementById("imagestatus");
    const progressdiv = document.getElementById("progressdiv");
    const progressbar = document.getElementById("progressbar");
    const imageaddress = document.getElementById("imageaddress");
    
    request.onreadystatechange = function () {
        if(request.status === 200){
            imageStatus.innerHTML = "your upload was successful"; //? i could use request.responsetype = "json"
            imageaddress.innerHTML = this.responseText; //* and reseave data from back end in json format
            selectedImage.value = "";
        }else{
            imageStatus.innerHTML = this.responseText
        }
        
    };

    request.open("POST", "/dashboard/image-upload");

    request.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            let result = Math.floor((e.loaded / e.total) * 100);
            if (result !== 100) {
                progressbar.innerHTML = result + "%";
                progressbar.style = "width:" + result + "%";
            } else {
                progressdiv.style = "display: none";
            }
        }
    };

    let formData = new FormData();

    if (selectedImage.files.length > 0) {
        progressdiv.style = "display: block";
        formData.append("image", selectedImage.files[0]);
        request.send(formData);
    } else {
        imageStatus.innerHTML = "choose an image for uploading";
    }
};

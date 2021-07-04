var slideindex = 0;
showslide();
function showslide(){
    
    var i;
    var slides = document.getElementsByClassName("carousel-item");
    for(i=0;i<slides.length;i++){
        slides[i].style.display= "none";
    }
    slideindex++;
    if(slideindex > slides.length){
        slideindex = 1;
    }
    slides[slideindex - 1].style.display = "block";
    setTimeout(showslide,15000);
} 

function nextslide(){

    var slides = document.getElementsByClassName("carousel-item");
    if(slideindex > slides.length){
        slideindex = 1;

    }
    slides[slideindex-1].style.display = "none";
    if(slideindex == 3){
        slides[0].style.display = "block";
    }
    slides[slideindex].style.display = "block";
    slideindex++;
    
}
function preslide(){

var slides = document.getElementsByClassName("carousel-item");
if(slideindex > slides.length){
    slideindex = 1;

}
slides[slideindex-1].style.display = "none";
if(slideindex-1 == 0){
    slides[2].style.display = "block";
}
slides[slideindex-2].style.display = "block";
slideindex--;

}
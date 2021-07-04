let saveB = document.getElementById('saveB')

saveB.addEventListener("click" , savepost);


function savepost(){
   const color = document.getElementById("save");
   if(color.style = "color:black"){
   color.style = "color:red";
   }else{
    color.style = "color:black";
   }
}



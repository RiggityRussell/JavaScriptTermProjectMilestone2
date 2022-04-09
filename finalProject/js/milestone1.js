document.getElementById("openNav").addEventListener("click",function(){
    document.getElementById("gameNav").style.width = "400px"
    document.getElementById("main").style.marginLeft = "400px"
});


document.getElementById("closebtn").addEventListener("click",function(){
    document.getElementById("gameNav").style.width = "0"
    document.getElementById("main").style.marginLeft = "0"
});
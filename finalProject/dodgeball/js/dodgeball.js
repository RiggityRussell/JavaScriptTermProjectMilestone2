window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, true);



var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;
var myMusic;
var mySound;
var redBalls = [];

function startGame() {
    myGamePiece = new component(40, 40, "media/normal.png", 2, 2, 'image');
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myBackground = new component(1700, 800, "media/court.jpg", 0, 0, "image");
    mySound = new sound("media/Ninja_dead.wav");
    myMusic = new sound("media/KevinMacLeod.mp3");
    myMusic.play()
    // myObstacle = new component(10,200, 'black', 300, 120);
    myGameArea.start();
    }
    
var myGameArea = {
canvas : document.getElementById("myCanvas"),
start : function() {
    
    this.canvas.width = 1700;
    this.canvas.height = 800;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;      
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('keydown', function (e) {
    myGameArea.keys = (myGameArea.keys || []);
    myGameArea.keys[e.keyCode] = true;
    })
    window.addEventListener('keyup', function (e) {
    myGameArea.keys[e.keyCode] = false;
    })
},
clear : function() {
this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
},
stop : function() {
    clearInterval(this.interval);
}
}

    function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
    }

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
    this.image = new Image();
    this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0
    this.speedY = 0
    this.x = x;
    this.y = y;
    this.update = function(){
    ctx = myGameArea.context;
    if (type == "image") {
        ctx.drawImage(this.image,
        this.x,
        this.y,
        this.width, this.height);
    } 
    else if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
    }
    
    else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    }
    this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
    (mytop > otherbottom) ||
    (myright < otherleft) ||
    (myleft > otherright)) {
        crash = false;
    }
    return crash;
    

    }
}

function throwBall() {

    // var c = document.getElementById("myCanvas");
    // var ctx = c.getContext("2d");
    // ctx.beginPath();
    // ctx.arc(myGamePiece.x, myGamePiece.y, 20, 0, 2 * Math.PI);
    // ctx.fillStyle = 'red'
    // ctx.fill() 
    //ctx.stroke();
    //new component(11, 5, "red", myGamePiece.x, myGamePiece.y);   

    let ball = new component(20,20, "media/dodgeball.png", myGamePiece.x + 5, myGamePiece.y +10, "image")              
    ball.newPos();
    ball.speedX = 10;
    redBalls.push( ball ); // add to array
}

function updateGameArea() {
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
        mySound.play();
        myGameArea.stop();
        return;
    }
    }
    myGameArea.clear();
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
    x = myGameArea.canvas.width;
    minHeight = 20;
    maxHeight = 650;
    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    minGap = 50;
    maxGap = 200;
    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    myObstacles.push(new component(100, height, "media/eat.png", x, 0, 'image'));
    myObstacles.push(new component(100, 600 - height - gap, "media/eat.png", x, height + gap,'image'));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    //myBackground.newPos();
    
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[32]) {throwBall()}
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -5}
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 5}
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -5}
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 5}
    
    myGamePiece.newPos();
    myGamePiece.update();
    redBalls.forEach( (ball)=> {
        ball.newPos() 
        ball.update();
      
        // //if (ball.newPos().x > 2000) {redBalls[ball].clear()}
    });    
}




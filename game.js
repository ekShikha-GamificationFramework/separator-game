var SCORE;
var GAMEOVER;
window.onload = function() {

var balls = [];
var colors = ["red", "green"];
var canvas = document.getElementById("canvasHolder");
var ctx = canvas.getContext("2d");

var minValue = 1, maxValue = 20;
var minSpeed = 80, maxSpeed = 120;
var ballRadius = 15;
var dividerWidth = 20;
var dividerSpace = 100;
var totalBallCount = 10;
var correctBalls = 0;
for(var i = 0; i < totalBallCount; i++) {
    balls.push(new Ball(Math.random()*(canvas.width-2*ballRadius)+ballRadius,
                        Math.random()*(canvas.height-2*ballRadius)+ballRadius,
                        colors[Math.floor(Math.random()*colors.length)],
                        Math.floor(Math.random()*(maxValue-minValue))+minValue,
                        Math.random()*(maxSpeed-minSpeed)+minSpeed,
                        Math.random()*(maxSpeed-minSpeed)+minSpeed));
}

//Ball constructor
function Ball(x, y, color, value, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.value = value;
    this.speedX = speedX;
    this.speedY = speedY;
}

var canvasPos = getPosition(canvas);
var mouseX = 0;
var mouseY = 0;

canvas.addEventListener("mousemove", setMousePosition, false);

function setMousePosition(e) {
    mouseX = e.clientX - canvasPos.x;
    mouseY = e.clientY - canvasPos.y;
}

function update(delta) {
    //update balls
    var changeX, changeY;
    for(var i = 0; i < totalBallCount; i++) {
        changeX = delta * balls[i].speedX;
        changeY = delta * balls[i].speedY;
        if(changeX > canvas.width - (balls[i].x + ballRadius)) {
            //collision in +x
            changeX -= (canvas.width - (balls[i].x + ballRadius));
            balls[i].x -= changeX;
            balls[i].speedX *= -1;
        } else if(changeX < 0 && Math.abs(changeX) > (balls[i].x - ballRadius)) {
            //collision in -x
            balls[i].x = ballRadius + (Math.abs(changeX) - (balls[i].x - ballRadius));
            balls[i].speedX *= -1;
        } else {
            balls[i].x += changeX;
        }
        if(changeY > canvas.height - (balls[i].y + ballRadius)) {
            //collision in +y
            changeY -= (canvas.height - (balls[i].y + ballRadius));
            balls[i].y -= changeY;
            balls[i].speedY *= -1;
        } else if(changeY < 0 && Math.abs(changeY) > (balls[i].y - ballRadius)) {
            //collision in -y
            balls[i].y = ballRadius + (Math.abs(changeY) - (balls[i].y - ballRadius));
            balls[i].speedY *= -1;
        } else {
            balls[i].y += changeY;
        }

        //collision detection with divider walls
        if((Math.abs(balls[i].x - canvas.width/2) <= ballRadius + dividerWidth/2)
            && (balls[i].y - ballRadius < (mouseY - dividerSpace/2) || balls[i].y + ballRadius > (mouseY + dividerSpace/2))
            ) {
            //collision
            //balls[i].color = "black";
            balls[i].speedX *= -1;
            if(balls[i].y < (mouseY - dividerSpace/2) || balls[i].y > (mouseY + dividerSpace/2)) {
                balls[i].x = (balls[i].x < canvas.width/2)? canvas.width/2 - dividerWidth/2 - ballRadius : canvas.width/2 + dividerWidth/2 + ballRadius;
            }
        } else {
            balls[i].color = "red";
        }
        if((Math.abs(balls[i].x - canvas.width/2) <= ballRadius + dividerWidth/2)
            && (((balls[i].y - (mouseY - dividerSpace/2)) < ballRadius && (balls[i].y - (mouseY - dividerSpace/2)) > 0)
                 || ((mouseY + dividerSpace/2) - balls[i].y > 0 && (mouseY + dividerSpace/2) - balls[i].y < ballRadius))
            ) {
            //collision
            //balls[i].color = "black";
            balls[i].speedY *= -1;
            balls[i].speedX *= -1;
        } else {
            //balls[i].color = "red";
        }
    }

    //check for winning condition
    correctBalls = 0;
    for(var i = 0; i < totalBallCount; i++) {
        if(balls[i].value%2 == 0) {
            //even
            if(balls[i].x < canvas.width/2 - ballRadius) {
                correctBalls++;
            }
        } else {
            //odd
            if(balls[i].x > canvas.width/2 + ballRadius) {
                correctBalls++;
            }
        }
    }
    if(correctBalls == totalBallCount)  {
        gameOver();
    }
}

function render() {

    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    //background
    // Create gradient
    var grd = ctx.createRadialGradient(canvas.width/2,canvas.height/2,10,canvas.width,canvas.height,1000);
    grd.addColorStop(1,"#25a836");
    grd.addColorStop(0,"#71dd7f");
    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //draw background text
    ctx.font = "100px 'TooneyNoodleNF'";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = 'center';
    ctx.fillText("EVEN", canvas.width/4, canvas.height/2 + 50);
    ctx.fillText("ODD", 3*canvas.width/4, canvas.height/2 + 50);

    //render balls
    ctx.font = "20px Calibri";
    for(var i = 0; i < balls.length; i++) {
        ctx.beginPath();
        //ctx.fillStyle = balls[i].color;
        ctx.fillStyle = "#ff2d2d";
        ctx.arc(balls[i].x, balls[i].y, ballRadius, 0, 2*Math.PI);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.textAlign = 'center';
        ctx.fillText(balls[i].value, balls[i].x, balls[i].y+5);
    }

    //reder moving walls
    //console.log(mouseX+ ", "+mouseY);
    ctx.fillStyle = "#42a4f4";
    ctx.strokeStyle = "#273cb2";
    var curveRadius = 10;
    //upper barrier
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 - dividerWidth/2, 0);
    ctx.lineTo(canvas.width/2 - dividerWidth/2, mouseY - dividerSpace/2 - curveRadius);
    ctx.quadraticCurveTo(canvas.width/2 - dividerWidth/2, mouseY - dividerSpace/2, canvas.width/2 - dividerWidth/2 + curveRadius, mouseY - dividerSpace/2);
    ctx.lineTo(canvas.width/2 + dividerWidth/2 - curveRadius, mouseY - dividerSpace/2);
    ctx.quadraticCurveTo(canvas.width/2 + dividerWidth/2, mouseY - dividerSpace/2, canvas.width/2 + dividerWidth/2, mouseY - dividerSpace/2 - curveRadius);
    ctx.lineTo(canvas.width/2 + dividerWidth/2, 0);
    ctx.fill();
    ctx.stroke();
    //lower barrier
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 - dividerWidth/2, canvas.height);
    ctx.lineTo(canvas.width/2 - dividerWidth/2, mouseY + dividerSpace/2 + curveRadius);
    ctx.quadraticCurveTo(canvas.width/2 - dividerWidth/2, mouseY + dividerSpace/2, canvas.width/2 - dividerWidth/2 + curveRadius, mouseY + dividerSpace/2);
    ctx.lineTo(canvas.width/2 + dividerWidth/2 - curveRadius, mouseY + dividerSpace/2);
    ctx.quadraticCurveTo(canvas.width/2 + dividerWidth/2, mouseY + dividerSpace/2, canvas.width/2 + dividerWidth/2, mouseY + dividerSpace/2 + curveRadius);
    ctx.lineTo(canvas.width/2 + dividerWidth/2, canvas.height);
    ctx.fill();
    ctx.stroke();

    //render UI
    ctx.font = '30px "TooneyNoodleNF"';
    ctx.fillStyle = "#000000";
    ctx.textAlign = 'left';
    ctx.fillText("Time: " + Math.floor((Date.now()- startTime)/1000) + "s", 20, 40);
    ctx.textAlign = 'right';
    ctx.fillText("Correct Balls: " + correctBalls, canvas.width - 20, 40);
}
//the main game loop
function loop() {
    var now = Date.now();
    var delta = now - then;

    if(!GAMEOVER) {
        update(delta / 1000);
        render();
    }

    then = now;

    //request to do this again
    requestAnimationFrame(loop);
}
//start the game
var then = Date.now();
var startTime = Date.now();
GAMEOVER = false;
loop();

function gameOver() {
    GAMEOVER = true;
    var timeTaken = Date.now() - startTime;
    console.log(timeTaken);
}

function getPosition(el) {
  var xPosition = 0;
  var yPosition = 0;
  while (el) {
    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
    yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    el = el.offsetParent;
  }
  return {
    x: xPosition,
    y: yPosition
  };
}

};

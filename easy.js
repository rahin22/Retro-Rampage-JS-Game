const canvas = document.querySelector(".GameWindow");
const c = canvas.getContext('2d');
const backgroundImage = new Image();
backgroundImage.src = 'images/road.png'; 
let highScore = 0;
let score = 0;
let gameStartTime = null;



canvas.width = 1000;
canvas.height = 500;

function gameOver() {
    const gameOverScreen = document.getElementById("game-over");
    gameOverScreen.style.display = "flex";

    if (score > highScore) {
        highScore = score;
    }
   
    const finalScoreElement = document.getElementById("final-score");
    finalScoreElement.textContent = "Final Score: " + score;

    const highScoreElement = document.getElementById("high-score");
    highScoreElement.textContent = "High Score: " + highScore;
}

function restartGame() {
    const gameOverScreen = document.getElementById("game-over");
    gameOverScreen.style.display = "none";
    player.position.x = 450;
    player.position.y = 390;
    obstacles.length = 0
    coins.length = 0
    powerUps.length = 0
    c.clearRect(0, 0, canvas.width, canvas.height);
    score = 0;
    const currentTime = Date.now();
    gameStartTime = currentTime;
    animate();
}

const restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", restartGame);


function collision(obj1, obj2){
    console.log("obj1:", obj1);
    console.log("obj2:", obj2);


    if(
        obj1.position.x + obj1.size.w >= obj2.position.x &&
        obj1.position.x <= obj2.position.x + obj2.size.w &&
        obj1.position.y + obj1.size.h >= obj2.position.y &&
        obj1.position.y <= obj2.position.y + obj2.size.h 
    ) {
        return true;
    } else {
        return false;
    }
} 


function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateScore() {
    c.fillStyle = "white";
    c.font = "20px 'Press Start 2P', Arial"; 
    c.fillText("Score: " + score, 20, 40);
    c.fillText("High Score:" + highScore, 700, 40);
}


function CheckAllSprites(newSprite){

    var flag = false;
    for (let i = 0; i < obstacles.length; i++) {
        if (collision(newSprite, obstacles[i])) {
            flag = true
        }
    }
    for (let i = 0; i < coins.length; i++) {
        if (collision(newSprite, coins[i])) {
            flag = true
        }
    }
    for (let i = 0; i < powerUps.length; i++) {
        if ( collision(newSprite, powerUps[i])) {
            flag = true
        }
    }

    for (let i = 0; i < doublePoints.length; i++) {
        if ( collision(newSprite, doublePoints[i])) {
            flag = true
        }
    }
    return flag

}

function spawnObstacle() {
    const randomX = getRandomNumber(178, 725);
    const randomY = getRandomNumber(10, 5);
    const newObstacle = new Sprite({ x: randomX, y: randomY }, { w: 50, h: 101 }, obstacleImage, "obstacle");


    if (CheckAllSprites(newObstacle)){
        return spawnObstacle();
    }
    
    obstacles.push(newObstacle);
}

function spawnCoin() {
    const randomX = getRandomNumber(178, 725);
    const randomY = getRandomNumber(10, 5);
    const newCoin = new Sprite({ x: randomX, y: randomY }, { w: 50, h: 50 }, coinImage, "coin");


    if (CheckAllSprites(newCoin)){
        return spawnCoin();
    }
    
    coins.push(newCoin);
}

function spawnPowerUp() {
    const randomX = getRandomNumber(178, 725);
    const randomY = getRandomNumber(10, 5);
    const newPowerUp = new Sprite({ x: randomX, y: randomY }, { w: 50, h: 50 }, powerImage, "powerUp");


    if (CheckAllSprites(newPowerUp)){
        return spawnPowerUp();
    }
    
    powerUps.push(newPowerUp);
}

function spawnDoublePoint() {
    const randomX = getRandomNumber(178, 725);
    const randomY = getRandomNumber(10, 5);
    const newDoublePoint = new Sprite({ x: randomX, y: randomY }, { w: 50, h: 50 }, doubleImage, "doublePoint");


    if (CheckAllSprites(newDoublePoint)){
        return spawnDoublePoint();
    }
    
    doublePoints.push(newDoublePoint);
}

const playerkeys = {
    left: {
        pressed: false
    },
    right: {
        pressed: false
    },
    up: {
        pressed: false
    },
    down: {
        pressed: false
    }
}


const turningImages = [];
turningImages[0] = new Image();
turningImages[0].src = 'images/car.png'; 
turningImages[1] = new Image();
turningImages[1].src = 'images/carleft.png'; 
turningImages[2] = new Image();
turningImages[2].src = 'images/carright.png'; 

let carTurningImage = 0;




const obstacleImage = new Image();
obstacleImage.src = 'images/obstacle.png'

const coinImage = new Image();
coinImage.src = 'images/coin.png';

const powerImage = new Image();
powerImage.src = 'images/power.png';

const doubleImage = new Image();
doubleImage.src = 'images/double.png';


class Sprite{
    constructor(position, size, image, type){
        this.position = position;
        this.size = size
        this.image = image
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y, this.size.w, this.size.h);
    }

}



const playerBound = {
    minX: 178,
    maxX: 775 - 50,
};

const playerImage = new Image();
playerImage.src = 'images/car.png';



class Player{
    constructor(position, size, image){
        this.position = position
        this.size = size
        this.image = image;
    }



    draw() {
        c.drawImage(turningImages[carTurningImage], this.position.x, this.position.y, this.size.w, this.size.h);
    }


    update(){              
        if (playerkeys.left.pressed && this.position.x > playerBound.minX) {
            carTurningImage = 1;
            this.position.x -= 4;
        } else if (playerkeys.right.pressed && this.position.x < playerBound.maxX) {
            carTurningImage = 2;
            this.position.x += 4;
            
        } else{
            carTurningImage = 0;
        }



        if (playerkeys.up.pressed && this.position.y > 0){
            this.position.y -= 2;
        }
        if (playerkeys.down.pressed && this.position.y < canvas.height - this.size.w){
            this.position.y += 5;
        }

    }
}

const player = new Player({ x: 450, y: 390 }, { w: 50, h: 101 }, playerImage);


const randomX = getRandomNumber(178,725); 
const randomY = getRandomNumber(10,5);


const obstacles = [];
const coins = [];
const powerUps = [];
const doublePoints = [];

let backgroundImageY1 = 0;
let backgroundImageY2 = canvas.height;
const backgroundImagespeed = 3.5;

var newCar = false;


const obstacleSpawnInterval = 1500; 
let lastObstacleSpawnTime = 0;
const scoredObstacles = [];


const coinSpawnInterval = 1000; 
let lastCoinSpawnTime = 0;


const powerUpSpawnInterval = 30000; 
let lastpowerUpSpawnTime = 0;
let isInvulnerable = false; 
let invulnerabilityDuration = 15000; 
let invulnerabilityStartTime = 0; 

const doublePointSpawnInterval = 35000; 
let lastDoublePointSpawnTime = 0;


function animate(timeStamp) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    backgroundImageY1 += backgroundImagespeed;
    backgroundImageY2 += backgroundImagespeed;

    if (backgroundImageY1 >= canvas.height) {
        backgroundImageY1 = -canvas.height;
    }

    if (backgroundImageY2 >= canvas.height) {
        backgroundImageY2 = -canvas.height;
    }
   

    c.drawImage(backgroundImage, 0, backgroundImageY1, canvas.width, canvas.height);
    c.drawImage(backgroundImage, 0, backgroundImageY2, canvas.width, canvas.height);

    const currentTime = Date.now();

    if (!gameStartTime) {
        gameStartTime = currentTime;
    }

    var elapsedTime = Math.floor((currentTime - gameStartTime) / 1000);

    c.fillText("Time: " + elapsedTime + "s", canvas.width - 590, 40);


    for (var i = 0; i < obstacles.length; i++){
        obstacles[i].position.y += backgroundImagespeed; 
    }

    for (var i = 0; i < coins.length; i++){
        coins[i].position.y += backgroundImagespeed; 
    }

    for (var i = 0; i < powerUps.length; i++){
        powerUps[i].position.y += backgroundImagespeed; 
    }


    for (var i = 0; i < doublePoints.length; i++){
        doublePoints[i].position.y += backgroundImagespeed; 
    }


    for (var i = 0; i < obstacles.length; i++){
        obstacles[i].draw();
    }

    for (var i = 0; i < coins.length; i++){
        coins[i].draw();
    }

    for (var i = 0; i < powerUps.length; i++){
        powerUps[i].draw();
    }

    for (var i = 0; i < doublePoints.length; i++){
        doublePoints[i].draw();
    }

    const randomX = getRandomNumber(178,725); 
    const randomY = getRandomNumber(10,5);


    var i = Math.floor(timeStamp /1500);

    if (i % 2 == 0){
        if (newCar == false){
            console.log("EVEN!")
            spawnObstacle();
            newCar = true;
        }
        
    } 
    else{
        newCar = false;
    }


    if (currentTime - lastObstacleSpawnTime >= obstacleSpawnInterval) {
        spawnObstacle();
        lastObstacleSpawnTime = currentTime;
    }

    if (currentTime - lastCoinSpawnTime >= coinSpawnInterval) {
        spawnCoin();
        lastCoinSpawnTime = currentTime;
    }

    if (currentTime - lastpowerUpSpawnTime >= powerUpSpawnInterval) {
        spawnPowerUp();
        lastpowerUpSpawnTime = currentTime;
    }

    if (currentTime - lastDoublePointSpawnTime >= doublePointSpawnInterval) {
        spawnDoublePoint();
        lastDoublePointSpawnTime = currentTime;
    }




    player.update();
    player.draw();
    updateScore();

    for (let i = 0; i < obstacles.length; i++) {
        if (isInvulnerable) {
            continue; 
        }

        if (collision(player, obstacles[i])) {
            console.log("Hit");
            gameOver();
            return;
        } else if (obstacles[i].position.y > canvas.height && !scoredObstacles.includes(obstacles[i])) {
            scoredObstacles.push(obstacles[i]);
            score += 1;
        }
    }
    

    for (let i = 0; i < coins.length; i++) {
        if (collision(player, coins[i])) {
            coins.splice(i, 1); 
            score += 10; 
        }
    }

    for (let i = 0; i < powerUps.length; i++) {
        if (collision(player, powerUps[i])) {
            powerUps.splice(i, 1); 
            isInvulnerable = true;
            invulnerabilityStartTime = Date.now(); 
        }
    }
    
    if (isInvulnerable) {
        const currentTime = Date.now();
        c.fillText("Shield Left: " + ((invulnerabilityStartTime + invulnerabilityDuration - currentTime)/1000).toString(), 20,80 )
        if (currentTime - invulnerabilityStartTime >= invulnerabilityDuration) {
            isInvulnerable = false;
        }
    }

    for (let i = 0; i < doublePoints.length; i++) {
        if (collision(player, doublePoints[i])) {
            doublePoints.splice(i, 1); 
            score *= 2; 
        }
    }


    window.requestAnimationFrame(animate);
}

backgroundImage.onload = function() {
    animate();
};




window.addEventListener("keydown", function(e) { 
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) { e.preventDefault(); } }, false);


document.addEventListener("keydown", keyDownHandler, false);
function keyDownHandler(event) {
    console.log(event.key)
    if (event.key == "a" || event.key == "ArrowLeft") {
        playerkeys.left.pressed = true;
    }
    if (event.key == "d" || event.key == "ArrowRight") {
        playerkeys.right.pressed = true;
    }
    if (event.key == "w" || event.key == "ArrowUp") {
        playerkeys.up.pressed = true;
    }
    if (event.key == "s" || event.key == "ArrowDown") {
        playerkeys.down.pressed = true;
    }
}


document.addEventListener("keyup", keyUpHandler, false);
function keyUpHandler(event) {
    if (event.key == "a" || event.key == "ArrowLeft") {
        playerkeys.left.pressed = false;
    }
    if (event.key == "d" || event.key == "ArrowRight") {
        playerkeys.right.pressed = false;
    }
    if (event.key == "w" || event.key == "ArrowUp") {
        playerkeys.up.pressed = false;
    }
    if (event.key == "s" || event.key == "ArrowDown") {
        playerkeys.down.pressed = false;
    }
}


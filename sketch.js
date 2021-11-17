var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg, zombie1Img, zombie2Img;
var zombieGroup, bulletGroup;
var bullet, bulletImg;
var score = 0;
var life = 3;
var bullets = 70;
var heart1Img, heart2Img, heart3Img;
var gameState = "fight";
var lose, winning, explosionSound;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png");
  shooter_shooting = loadImage("assets/shooter_3.png");
  zombieImg = loadImage("assets/zombie.png");
  bgImg = loadImage("assets/bg.jpeg");
  zombie1Img = loadImage("assets/zombie1.png");
  zombie2Img = loadImage("assets/zombie2.png");
  bulletImg = loadImage("assets/bullet.png"); 
  heart1Img = loadImage("assets/heart_1.png"); 
  heart2Img = loadImage("assets/heart_2.png"); 
  heart3Img = loadImage("assets/heart_3.png");
  
  lose = loadSound("assets/lose.mp3");
  winning = loadSound("assets/win.mp3"); 
  explosion = loadSound("assets/explosion.mp3");
  
}

function setup() {
  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
  bg.addImage(bgImg)
  bg.scale = 1.1
  

//creating the player sprite
 player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300);

 heart1 = createSprite(displayWidth-150,40,20,20);
 heart1.visible = false;
 heart1.addImage("heart1",heart1Img);
 heart1.scale = 0.4;

 heart2 = createSprite(displayWidth-100,40,20,20);
 heart2.visible = false;
 heart2.addImage("heart2",heart2Img);
 heart2.scale = 0.4;

 heart3 = createSprite(displayWidth-150,40,20,20);
 heart3.visible = true;
 heart3.addImage("heart3",heart3Img);
 heart3.scale = 0.4;

 zombieGroup = new Group(); 
 bulletGroup = new Group();
}

function draw() {
  background(0); 

if(gameState === "fight") {

//displaying the appropriate image according to lives remaining
if(life === 3) { 
heart3.visible = true;
heart1.visible = false;
heart2.visible = false;
}

if(life === 2) { 
  heart3.visible = false;
  heart1.visible = false;
  heart2.visible = true;
  }

if(life === 1) { 
  heart3.visible = false;
  heart1.visible = true;
  heart2.visible = false;
  }

if(life === 0) {
  gameState = "lost"
  lose.play();
}

if(score === 100) {
  gameState = "won"
  win.play();
}

  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
 bullet = createSprite(displayWidth - 1150,player.y-30,20,10);
 bulletGroup.add(bullet);
 bullet.addImage(bulletImg);
 bullet.scale = 0.15;
 bullet.velocityX = 20; 
 bullets = bullets - 1;
 explosion.play();
 player.addImage(shooter_shooting);
 
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

if(bullets === 0)
{
  gameState = "bullet" 
  lose.play();
}

//destroying the zombies
if(zombieGroup.isTouching(bulletGroup)) 
{
for(var i = 0; i < zombieGroup.length; i++)
{
  if(zombieGroup[i].isTouching(bulletGroup)) {
  zombieGroup[i].destroy();
  bulletGroup.destroyEach();
  score = score + 2;
  }
}
}

//destroying the player
if(zombieGroup.isTouching(player)) {
  for(var i = 0; i < zombieGroup.length; i++)
  {
    if(zombieGroup[i].isTouching(player)) {
    zombieGroup[i].destroy();
    life = life-1;
    }
  }
}

enemy();
} //closing the gameState("fight")
drawSprites();

//displaying score
textSize(20);
fill("white")
text("Bullets = " + bullets,displayWidth-210,displayHeight/2-250);
text("Score = " + score, displayWidth-200,displayHeight/2-220);
text("Lives = " + life,displayWidth-200,displayHeight/2-280);

if(gameState === "lost") {
  textSize(100);
  fill("red");
  text("You Lost!", 400, 400);
  zombieGroup.destroyEach(); 
  player.destroy();
}
else if(gameState === "won")
{
  textSize(100);
  fill("green");
  text("You Won!", 400, 400);
  zombieGroup.destroyEach(); 
  player.destroy();
}
}

function enemy()
{
  if(frameCount%50===0) {
  zombie = createSprite(random(500,1100),random(100,500),40,40);
  zombie.velocityX = -4
  var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: zombie.addImage(zombieImg);
              zombie.scale = 0.15;
              break;
      case 2: zombie.addImage(zombie1Img);
              zombie.scale = 0.4
              break;
      case 3: zombie.addImage(zombie2Img);
              zombie.scale = 0.5
              break;
      default: break;
    }
    zombie.lifetime = 400; 
    zombieGroup.add(zombie);
  }
  
}
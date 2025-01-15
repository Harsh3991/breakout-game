const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const restartButton = document.querySelector('#restartButton')
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const boardWidth = 560
const boardHeight = 300
let xDirection = -2
let yDirection = 2

const userStart = [230, 10]
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

let timerId
let score = 0

//my block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + blockWidth, yAxis]
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    this.topLeft = [xAxis, yAxis + blockHeight]
  }
}

//all my blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
]

//draw my blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = blocks[i].bottomLeft[0] + 'px'  
    block.style.bottom = blocks[i].bottomLeft[1] + 'px'  
    grid.appendChild(block)
    console.log(blocks[i].bottomLeft)
  }
}
addBlocks()

//add user
const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()

//add ball
const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)
drawBall()

let moveDirection = null;

//move user
function moveUser() {
  if (moveDirection === 'left' && currentPosition[0] > 0) {
    currentPosition[0] -= 4;
  } else if (moveDirection === 'right' && currentPosition[0] < (boardWidth - blockWidth)) {
    currentPosition[0] += 4;
  }
  drawUser();
  requestAnimationFrame(moveUser);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    moveDirection = 'left';
  } else if (e.key === 'ArrowRight') {
    moveDirection = 'right';
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    moveDirection = null;
  }
});

// Start the animation loop
moveUser();

//draw User
function drawUser() {
  user.style.left = currentPosition[0] + 'px'
  user.style.bottom = currentPosition[1] + 'px'
}

//draw Ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px'
  ball.style.bottom = ballCurrentPosition[1] + 'px'
}

//move ball
function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}
timerId = setInterval(moveBall, 15)

//check for collisions
function checkForCollisions() {
  //check for block collision
  for (let i = 0; i < blocks.length; i++){
    if
    (
      (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
      ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]) 
    )
      {
      const allBlocks = Array.from(document.querySelectorAll('.block'))
      allBlocks[i].classList.remove('block')
      blocks.splice(i,1)
      changeDirection()   
      score++
      scoreDisplay.innerHTML = score
      if (blocks.length == 0) {
        scoreDisplay.innerHTML = 'You Win!'
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
        showRestartButton()
      }
    }
  }
  // check for wall hits
  if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= 0 || ballCurrentPosition[1] >= (boardHeight - ballDiameter))
  {
    changeDirection()
  }

  //check for user collision
  if
  (
    (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight ) 
  )
  {
    changeDirection()
  }

  //game over
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId)
    scoreDisplay.innerHTML = 'You lose!'
    document.removeEventListener('keydown', moveUser)
    showRestartButton()
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2
    return
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2
    return
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2
    return
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2
    return
  }
}

function showRestartButton() {
  restartButton.style.display = 'block';
}

restartButton.addEventListener('click', restartGame);

function restartGame() {
  // Reset game state
  clearInterval(timerId);
  score = 0;
  scoreDisplay.innerHTML = score;
  
  // Clear existing blocks
  const allBlocks = Array.from(document.querySelectorAll('.block'));
  allBlocks.forEach(block => block.remove());
  
  // Reset blocks array
  blocks.length = 0;
  blocks.push(
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210)
  );
  
  // Add new blocks
  addBlocks();
  
  // Reset user and ball positions
  currentPosition = userStart;
  ballCurrentPosition = ballStart;
  xDirection = -2;
  yDirection = 2;
  drawUser();
  drawBall();
  
  // Hide restart button
  restartButton.style.display = 'none';
  
  // Reattach event listeners
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  // Restart the game loop
  timerId = setInterval(moveBall, 15);
}

function handleKeyDown(e) {
  if (e.key === 'ArrowLeft') {
    moveDirection = 'left';
  } else if (e.key === 'ArrowRight') {
    moveDirection = 'right';
  }
}

function handleKeyUp(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    moveDirection = null;
  }
}

// Attach event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
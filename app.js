const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    player1El = document.getElementById('player1score'),
    player2El = document.getElementById('player2score'),
    playBtn = document.getElementById('btn-play');

let player1Score = 0;
let player2Score = 0;

// Objects for Ball, Player Paddles, and Net

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 2.5,
    dx: 2,
    dy: 2,
    
}


const net = {
    x: (canvas.width-2)/2,
    y: 0,
    height: 10,
    width: 2,
    color: "WHITE"
}

const player1 = {
    x: 0,
    y: (canvas.height / 2) -50,
    w: 12,
    h: 100,
    speed: 4,
    dy: 0,
    score: 0
}

const player2 = {
    x: canvas.width - 12,
    y: (canvas.height / 2) -50 ,
    w: 12,
    h: 100,
    speed: 4,
    dy: 0,
    score: 0
}



function drawNet() {
   
    for(let i=0; i <= canvas.height; i+=15) {
        ctx.fillStyle = 'WHITE';
        ctx.fillRect(net.x, net.y + i, net.width, net.height)
    }
    
}

// Ball Related Functions

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI *2);
    ctx.fillStyle = '#dcfd50';
    ctx.fill();
    ctx.closePath();
}


function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    let currentPlayer = ((ball.x + ball.size) < (canvas.width/2)) ? player1 : player2;

    // Wall Collision X Axis
    if(ball.x - ball.size < 0 || ball.x + ball.size > canvas.width) {
        ball.dx *= -1;
    }

    // Wall Collision Y Axis
    if(ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy *= -1;
    }

    


    if(collission(ball, currentPlayer)) {
        let collidePoint = (ball.y - (currentPlayer.y + currentPlayer.h/2));

        collidePoint = collidePoint / (currentPlayer.h/2)

        let angleRad = (Math.PI/4) * collidePoint;
        let direction = (ball.x + ball.size < canvas.width/2) ? 1 : -1;
        ball.dx = direction * ball.speed * Math.cos(angleRad);
        ball.dy = ball.speed * Math.sin(angleRad);

        ball.speed += .1;


    }


    // Check if player scores 

    if(ball.x - ball.size < 0) {
        player2.score++;
        incrementScore('player2')
        resetBall();
    } else if(ball.x + ball.size > canvas.width) {
        player1.score++;
        incrementScore('player1')
        resetBall();
    }  
}



function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 2.5;
    ball.dx = -ball.dx;
    
    
}


// Paddle || Player Related Functions

function drawPaddle(paddlex, paddley, paddlew, paddleh) {
    ctx.beginPath;
    ctx.rect(paddlex, paddley, paddlew, paddleh);
    ctx.fillStyle = '#336699';
    ctx.fill();
    ctx.closePath();
}

function keyDown(e) {
    if(e.key === 'Up' || e.key === 'ArrowUp' ) {
        player2.dy = -player2.speed
    } else if(e.key === 'Down' || e.key === 'ArrowDown') {
        player2.dy = player2.speed
    }

    // add player 1 key if statments here later
    if(e.key === 'w') {
        player1.dy = -player1.speed
    } else if(e.key === 's') {
        player1.dy = player1.speed
    }
}

function keyUp(e) {
    if(e.key === 'Up' || e.key === 'ArrowUp' || e.key === 'Down' || e.key === 'ArrowDown') {
        player2.dy = 0;
    }

    if(e.key === 'w' || e.key === 's') {
        player1.dy = 0;
    }
}

function movePaddles(player) {
    player.y += player.dy;

    //    Bottom wall boundries
    if(player.y + player.h > canvas.height) {
        player.y = canvas.height - player.h
        
    }
    // Top Wall Boundries
    if(player.y < 0 ) {
        player.y = 0
    }
}

function collission(ball, player) {
    // Refers to the players specific x and y definitions not to exact coordinates 
    player.top = player.y;
    player.bottom = player.y + player.h;
    player.left = player.x;
    player.right = player.x + player.w;

    ball.top = ball.y - ball.size;
    ball.bottom = ball.y + ball.size;
    ball.left = ball.x - ball.size;
    ball.right = ball.x + ball.size;

    return player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top;
} 



// Game related functions


function draw() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
   
    drawPaddle(player1.x, player1.y, player1.w, player1.h)
    drawPaddle(player2.x, player2.y, player2.w, player2.h)
    drawNet();
    drawBall();
    
    
    
}

function update(){
    movePaddles(player1)
    movePaddles(player2)
    moveBall();
    draw();
    requestAnimationFrame(update)
}



function incrementScore(player) {
    if(player == 'player1') {
        const player1El = document.getElementById('player1score');
        player1El.innerHTML = player1.score;
    } else if(player == 'player2') {
        const player2El = document.getElementById('player2score');
        player2El.innerHTML = player2.score;
    }


}






draw();









// Event Listners
document.addEventListener('keydown', (e) => keyDown(e));
document.addEventListener('keyup', (e) => keyUp(e));
playBtn.addEventListener('click', update, {once:true});

// window.addEventListener('resize', resizeCanvas)





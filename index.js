import { Quadtree, init, Sprite, GameLoop, Pool } from './node_modules/kontra/kontra.mjs';

import {initKeys, keyPressed } from './node_modules/kontra/kontra.mjs';

let { canvas, context } = init();
initKeys();
let quadtree = Quadtree({maxObjects:1, maxDepth: 10});
console.log(quadtree.maxObjects,'.....');
let ball = Sprite({
    x: 80,
    y: 60,
    color:"magenta",
    height: 5,
    width: 5
}); // can we make the ball pulsate?


let player = Sprite({
    x: 100,
    y: 80,
    color: "#ff0000",
    //dx : 1,
    height: 10,
    width: 100,
});


let pool = Pool({
  // create a new sprite every time the pool needs a new object
  create: Sprite
});

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// properties will be passed to the sprites init() function
for (let x=0; x < 600; x+= 30) {
    for (let y=0; y < 200; y += 21) {
	pool.get({
	    x: 100 + x,
	    y: 200 + y,
	    width: 20,
	    height: 10,
	    color: sample(['red','lightgreen','yellow']),
	    ttl: Infinity,
	});
    }
}


const clipBounds = (player) => {
    if (player.x >= (canvas.width - 2*player.width)) {
	player.x = canvas.width - 2*player.width;
    }
    
    if (player.x <= 0) {
	player.x = 0;
    }
    

}

let hasBall = false;
let loop = GameLoop({
    update: function() {
	quadtree.clear();
	quadtree.add(ball,pool.getAliveObjects());
	player.update();
	ball.update();
	pool.update();
	if (keyPressed("left")){
	    player.x -= 10;
	}
	if (keyPressed("right")){
	    player.x += 10;
	}
	if (keyPressed("space") && !hasBall){
	    console.log("FIRE!");
	    hasBall = true;
	    ball.x = player.x;
	    ball.y = player.y;
	    ball.dx = Math.random()*10+1;
	    ball.dy = Math.random()*10+1;
	}

	const hits = quadtree.get(ball);
	if(hits.length > 0){
	    console.log(hits);
	    for(let hit of hits) {
		hit.ttl =0;
		ball.dy = -1 * ball.dy;
	    }
	}
	if ((ball.collidesWith(player)) ||
	     (ball.x < 0) ||
	     (ball.x >= canvas.width )) {
	    ball.dx = -1 * ball.dx;
	}
	if ((ball.collidesWith(player)) ||
	     (ball.y < 0) ||
	     (ball.y >= canvas.height)) {
	    ball.dy = -1 * ball.dy;
	}


	
	clipBounds(player);
    },

    render: function() {
	player.render();
	pool.render();
	ball.render();
    },
});
loop.start();

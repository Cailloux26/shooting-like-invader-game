window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded() {
	canvasApp();
}
function supportedAudioFormat(audio) {
	var returnExtension = "";
	if (audio.canPlayType("audio/ogg") == "probably" || audio.canPlayType("audio/ogg") == "maybe") {
		returnExtension = "ogg";
	} else if(audio.canPlayType("audio/wav") == "probably" || audio.canPlayType("audio/wav") == "maybe") {
		returnExtension = "wav";
	} else if(audio.canPlayType("audio/mp3") == "probably" || audio.canPlayType("audio/mp3") == "maybe") {
		returnExtension = "mp3";
	}
	return returnExtension;
}

function canvasSupport () {
	return Modernizr.canvas;
}
function canvasApp() {

	var STATE_INIT = 10;
	var STATE_LOADING = 20;
	var STATE_RESET = 30;
	var STATE_PLAYING = 40;
	var STATE_END = 50;

	var appState = STATE_INIT;
	
	var loadCount = 0;
	var itemsToLoad = 0;

	var alienImage = new Image();
	var missileImage = new Image();
	var playerImage = new Image();


	var SOUND_EXPLODE = "explode1";
	var SOUND_SHOOT = "shoot1";
	var MAX_SOUNDS = 6;
	var soundPool = new Array();
	var explodeSound;
	var explodeSound2;
	var explodeSound3;
	var shootSound;
	var shootSound2;
	var shootSound3;
	var audioType;


	var mouseX;
	var mouseY;
	var player = {x:250, y:475, width:0, height:0};
	var aliens = new Array();
	var missiles = new Array();
	var circles = new Array();
	var rectangles = new Array();
	var triangles = new Array();

	var ALIEN_START_X = 25;
	var ALIEN_START_Y = 25;
	var ALIEN_ROWS = 4;
	var ALIEN_COLS = 8;
	var ALIEN_SPACING = 40;

	var CIRCLE_START_X = 25;
	var CIRCLE_START_Y = 25;
	var CIRCLE_NUM = 1;
	var CIRCLE_OTHERCHANGE = 3;

	var RECT_START_X = 250;
	var RECT_START_Y = 250;
	var RECT_NUM = 1;
	var RECT_OTHERCHANGE = 1;

	var TRIANGLE_START_X = 30;
	var TRIANGLE_START_Y = 300;
	var TRIANGLE_NUM = 1;
	var TRIANGLE_OTHERCHANGE = 1;

	var CONT_LINK_TEXT="CONTINUE";
	var CONT_LINK_X=110;
	var CONT_LINK_Y=250;
	var CONT_LINK_HEIGHT=10;
	var CONT_LINK_WIDTH;
	var CONT_ISLINK = false;

	var END_LINK_TEXT="RESTART";
	var END_LINK_X=110;
	var END_LINK_Y=300;
	var END_LINK_HEIGHT=10;
	var END_LINK_WIDTH;
	var END_ISLINK = false;

	var LEVEL_X = 420;
	var LEVEL_Y = 20;
	var LEVEL = 0;

	if (!canvasSupport()) {
		return;
	}

	var camvasForShooting = document.getElementById("canvasForShooting");
	var context = camvasForShooting.getContext("2d");

	function itemLoaded(event) {

		loadCount++;
		if (loadCount >= itemsToLoad) {

			shootSound.removeEventListener("canplaythrough", itemLoaded, false);
			shootSound2.removeEventListener("canplaythrough", itemLoaded, false);
			shootSound3.removeEventListener("canplaythrough", itemLoaded, false);
			explodeSound.removeEventListener("canplaythrough", itemLoaded, false);
			explodeSound2.removeEventListener("canplaythrough", itemLoaded, false);
			explodeSound3.removeEventListener("canplaythrough", itemLoaded, false);
			soundPool.push({name:"explode1", element:explodeSound, played:false});
			soundPool.push({name:"explode1", element:explodeSound2, played:false});
			soundPool.push({name:"explode1", element:explodeSound3, played:false});
			soundPool.push({name:"shoot1", element:shootSound, played:false});
			soundPool.push({name:"shoot1", element:shootSound2, played:false});
			soundPool.push({name:"shoot1", element:shootSound3, played:false});
			appState = STATE_RESET;
		}
	}

	function initApp() {
		loadCount = 0;
		itemsToLoad = 9;
		explodeSound = document.createElement("audio");
		document.body.appendChild(explodeSound);
		audioType = supportedAudioFormat(explodeSound);
		explodeSound.addEventListener("canplaythrough", itemLoaded, false);
		explodeSound.setAttribute("src", "./resources/explode1." + audioType);

		explodeSound2 = document.createElement("audio");
		document.body.appendChild(explodeSound2);
		explodeSound2.addEventListener("canplaythrough", itemLoaded, false);
		explodeSound2.setAttribute("src", "./resources/explode1." + audioType);

		explodeSound3 = document.createElement("audio");
		document.body.appendChild(explodeSound3);
		explodeSound3.addEventListener("canplaythrough", itemLoaded, false);
		explodeSound3.setAttribute("src", "./resources/explode1." + audioType);

		shootSound = document.createElement("audio");
		document.body.appendChild(shootSound);
		shootSound.addEventListener("canplaythrough", itemLoaded, false);
		shootSound.setAttribute("src", "./resources/shoot1." + audioType);

		shootSound2 = document.createElement("audio");
		document.body.appendChild(shootSound2);
		shootSound2.addEventListener("canplaythrough", itemLoaded, false);
		shootSound2.setAttribute("src", "./resources/shoot1." + audioType);

		shootSound3 = document.createElement("audio");
		document.body.appendChild(shootSound3);
		shootSound3.addEventListener("canplaythrough", itemLoaded, false);
		shootSound3.setAttribute("src", "./resources/shoot1." + audioType);

		alienImage = new Image();
		alienImage.onload = itemLoaded;
		alienImage.src = "./resources/alien.png";
		alien2Image = new Image();
		alien2Image.onload = itemLoaded;
		alien2Image.src = "./resources/alien2.png";
		playerImage = new Image();
		playerImage.onload = itemLoaded;
		playerImage.src = "./resources/rose.png";
		player.width = playerImage.width;
		player.height = playerImage.height;
		missileImage = new Image();
		missileImage.onload = itemLoaded;
		missileImage.src = "./resources/toge.png";
		appState = STATE_LOADING;

	}

	function startLevel() {
		LEVEL++;

		//set Aliens
		for (var r = 0; r < ALIEN_ROWS; r++) {
			for( var c = 0; c < ALIEN_COLS; c++) {
				if(r%4==0){
					aliens.push({speed:2, x:ALIEN_START_X+c*ALIEN_SPACING, y:ALIEN_START_Y+r*ALIEN_SPACING, width:alienImage.width, height:alienImage.height});
				}else{
					aliens.push({speed:2, x:ALIEN_START_X+c*ALIEN_SPACING, y:ALIEN_START_Y+r*ALIEN_SPACING, width:alienImage.width, height:alienImage.height});
				}
				
			}
		}
		//set Circles
		for (var r = 0; r < CIRCLE_NUM; r++) {
			circles.push({speed:2, x:CIRCLE_START_X+((Math.random() * 600) + 1), y:CIRCLE_START_Y+((Math.random() * 100) + 1), otherchange:CIRCLE_OTHERCHANGE,width:20, height:20});
		}
		//set rectangle
		for (var r = 0; r < RECT_NUM; r++) {
			rectangles.push({speed:1, x:RECT_START_X+((Math.random() * 200) + 1), y:RECT_START_Y+((Math.random() * 50) + 1), otherchange:RECT_OTHERCHANGE,width:20, height:20});
		}

		//set traiangles
		for (var r = 0; r < TRIANGLE_NUM; r++) {
			triangles.push({speed:1, x:TRIANGLE_START_X+((Math.random() * 200) + 1), y:TRIANGLE_START_Y+((Math.random() * 50) + 1), otherchange:RECT_OTHERCHANGE,width:20, height:20});
		}

	}

	function resetApp() {

		playSound(SOUND_EXPLODE, 0);
		playSound(SOUND_SHOOT, 0);
		startLevel();
		appState = STATE_PLAYING;
	}

	function endApp(){
		//console.log("endApp");
		var camvasForShooting = document.getElementById("canvasForShooting");
		//draw ending background
		context.fillStyle = 'gray';

		context.fillRect(0,0,500,500); 
		//Draw Text
		context.fillStyle = "#FFFFFF";
		context.font = '28pt Calibri';
		context.fillText("RESTART or not? ", 100, 200);

/*		//draw the continue link
		context.font='18px sans-serif';
		context.fillStyle = "#0000ff";
		context.fillText(CONT_LINK_TEXT,CONT_LINK_X,CONT_LINK_Y);
		CONT_LINK_WIDTH=context.measureText(CONT_LINK_TEXT).width+100;
*/
		//draw the continue link
		context.font='18px sans-serif';
		context.fillStyle = "#0000ff";
		context.fillText(END_LINK_TEXT,END_LINK_X,END_LINK_Y);
		END_LINK_WIDTH=context.measureText(END_LINK_WIDTH).width+100;

		//add mouse listeners
		camvasForShooting.addEventListener("mousemove", on_mousemove, false);
		camvasForShooting.addEventListener("click", on_click, false);
	}

	//check if the mouse is over the link and change cursor style
	function on_mousemove (ev) {
	var x, y;

	// Get the mouse position relative to the canvas element.
	if (ev.layerX || ev.layerX == 0) { //for firefox
		x = ev.layerX;
		y = ev.layerY;
	}
	x-=camvasForShooting.offsetLeft;
	y-=camvasForShooting.offsetTop;

	//is the mouse over the link?
	/*if(x>=CONT_LINK_X && x <= (CONT_LINK_X + CONT_LINK_WIDTH) && y<=CONT_LINK_Y && y>= (CONT_LINK_Y-CONT_LINK_HEIGHT)){
		document.body.style.cursor = "pointer";
		CONT_ISLINK=true;
	}else */if(x>=END_LINK_X && x <= (END_LINK_X + END_LINK_WIDTH) && y<=END_LINK_Y && y>= (END_LINK_Y-END_LINK_HEIGHT)){
		document.body.style.cursor = "pointer";
		END_ISLINK=true;
	}
	else{
		document.body.style.cursor = "";
		//CONT_ISLINK=false;
		END_ISLINK=false;
	}
	}

	//if the link has been clicked, go to link
	function on_click(e) {
		/*if (CONT_ISLINK)  {
			appState = STATE_RESET;
			console.log("cont");
		}else */if(END_ISLINK){
			appState = STATE_RESET;
			aliens = new Array();
			missiles = new Array();
			circles = new Array();
			rectangles = new Array();
			LEVEL = 0;
		}
		camvasForShooting.removeEventListener("mousemove", on_mousemove, false);
		camvasForShooting.removeEventListener("click", on_click, false);
	}

	function  drawScreen () {

		//Move missiles
		for (var i= missiles.length-1; i >= 0; i--) {
			missiles[i].y -= missiles[i].speed;
			if (missiles[i].y < (0-missiles[i].height)) {
				missiles.splice(i, 1);
			}
		}

		//Move Aliens
		for (var i= aliens.length-1; i >= 0; i--) {
			aliens[i].x += aliens[i].speed;
			if (aliens[i].x > (camvasForShooting.width-aliens[i].width) || aliens[i].x < 0) {
				aliens[i].speed *= -1;
				aliens[i].y += 20;
			}
			if (aliens[i].y > camvasForShooting.height) {
				aliens.splice(i,1);
			}
		}

		//Move circles
		for (var i= circles.length-1; i >= 0; i--) {

			if (circles[i].x>=camvasForShooting.width||circles[i].x<=0) { 
			 circles[i].speed = -circles[i].speed 
			} 
			circles[i].x = circles[i].x + circles[i].speed; 
			 
			if(circles[i].y>=camvasForShooting.height ||circles[i].y<=0) { 
			 circles[i].otherchange = -circles[i].otherchange; 
			} 
			circles[i].y = circles[i].y + circles[i].otherchange; 
		}

		//Move rectangles
		for (var i= rectangles.length-1; i >= 0; i--) {

			if (rectangles[i].x>=camvasForShooting.width||rectangles[i].x<=0) { 
			 rectangles[i].speed = -rectangles[i].speed 
			} 
			rectangles[i].x = rectangles[i].x + rectangles[i].speed; 
			 
			if(rectangles[i].y>=camvasForShooting.height ||rectangles[i].y<=0) { 
			 rectangles[i].otherchange = -rectangles[i].otherchange; 
			} 
			rectangles[i].y = rectangles[i].y + rectangles[i].otherchange; 

		}

		//Move triangles
		for (var i= triangles.length-1; i >= 0; i--) {

			if (triangles[i].x>=camvasForShooting.width||triangles[i].x<=0) { 
			 triangles[i].speed = -triangles[i].speed 
			} 
			triangles[i].x = triangles[i].x + triangles[i].speed; 
			 
/*			if(rectangles[i].y>=camvasForShooting.height ||rectangles[i].y<=0) { 
			 rectangles[i].otherchange = -rectangles[i].otherchange; 
			} 
			rectangles[i].y = rectangles[i].y + rectangles[i].otherchange; */

		}

		//Detect Collisions

		missile: for (var i = missiles.length-1; i >= 0; i--) {
			var tempMissile = missiles[i]

			for (var j = triangles.length-1; j >= 0; j--) {
				var tempTriangle = triangles[j];
				if (hitTest(tempMissile, tempTriangle)) {
					playSound(SOUND_EXPLODE, .5);
					missiles.splice(i, 1);
					triangles.splice(j, 1);
					break missile;
				}
			}
			for (var j = aliens.length-1; j >= 0; j--) {
				var tempAlien = aliens[j];
				if (hitTest(tempMissile, tempAlien)) {
					playSound(SOUND_EXPLODE, .5);
					missiles.splice(i, 1);
					aliens.splice(j, 1);
					break missile;
				}
			}
		}

		aliens: for (var j = aliens.length-1; j >= 0; j--) {
				var tempAlien = aliens[j];
				if (hitTest(player, tempAlien)) {
					playSound(SOUND_EXPLODE, .5);
					appState = STATE_END;
					break aliens;
				}
		}

		circle: for (var j = circles.length-1; j >= 0; j--) {
				var tempCircle = circles[j];
				if (hitTest(player, tempCircle)) {
					playSound(SOUND_EXPLODE, .5);
					appState = STATE_END;
					break circle;
				}
		}

		rectangle: for (var j = rectangles.length-1; j >= 0; j--) {
				var tempRectangle = rectangles[j];
				if (hitTest(player, tempRectangle)) {
					playSound(SOUND_EXPLODE, .5);
					appState = STATE_END;
					break rectangle;
				}
		}

		triangle: for (var j = triangles.length-1; j >= 0; j--) {
				var tempTriangle = triangles[j];
				if (hitTest(player, tempTriangle)) {
					playSound(SOUND_EXPLODE, .5);
					appState = STATE_END;
					break triangle;
				}
		}

		if (aliens.length <= 0) {
			appState = STATE_RESET;
		}

		//Background
		context.fillStyle = "#000000";
		context.fillRect(0, 0, camvasForShooting.width, camvasForShooting.height);
		//Box
		context.strokeStyle = "#EEEEEE"; 
		context.strokeRect(5, 5, camvasForShooting.width-10, camvasForShooting.height-10);
		//Draw Player
		context.drawImage(playerImage, player.x, player.y);
		//Draw Missiles
		for (var i = missiles.length-1; i >= 0; i--) {
			context.drawImage(missileImage, missiles[i].x, missiles[i].y);
		}

		//draw aliens
		for (var i = aliens.length-1; i >= 0; i--) {
			if((i%2)===0){
				context.drawImage(alien2Image, aliens[i].x, aliens[i].y);
			}else{
				context.drawImage(alienImage, aliens[i].x, aliens[i].y);
			}
			
			
		}

		//draw circles
		for (var i = circles.length-1; i >= 0; i--) {
			context.fillStyle = 'red'; 
			context.beginPath(); 
			context.arc(circles[i].x,circles[i].y,5,0,Math.PI*2,true); 
			context.fill(); 
		}
		//draw rectangles
		for (var i = rectangles.length-1; i >= 0; i--) {
			context.fillStyle = 'blue'; 
			context.fillRect(rectangles[i].x,rectangles[i].y,5,5); 
		}
		//draw triangles
		for (var i = triangles.length-1; i >= 0; i--) {
			context.moveTo(triangles[i].x,triangles[i].y); 
			context.lineTo(triangles[i].x+5,triangles[i].y+5); 
			context.lineTo(triangles[i].x-5,triangles[i].y+5); 
			context.closePath(); 
			context.fillStyle = "yellow"; 
			context.fill(); 
		}

		//Draw LEVEL
		context.fillStyle = "#FFFFFF";
		context.font = '12pt Calibri';
		context.fillText("LEVEL " + LEVEL, LEVEL_X, LEVEL_Y);

	}

	function hitTest(image1, image2) {
		r1left = image1.x;
		r1top  = image1.y;
		r1right = image1.x + image1.width;
		r1bottom = image1.y + image1.height;
		r2left = image2.x;
		r2top  = image2.y;
		r2right = image2.x + image2.width;
		r2bottom = image2.y + image2.height;
		retval = false;

		if ((r1left > r2right) || (r1right < r2left) || (r1bottom < r2top) || (r1top > r2bottom)) {
			retval = false;
		} else {
			retval = true;
		}
		return retval;
	}

	function eventMouseMove(event) {
		if (event.layerX || event.layerX == 0) { // Firefox
			mouseX = event.layerX;
			mouseY = event.layerY;
		} else if (event.offsetX || event.offsetX == 0) { // Opera
			mouseX = event.offsetX;
			mouseY = event.offsetY;
		}
		player.x = mouseX;
		player.y = mouseY;
	}

	function eventMouseUp(event) {
		missiles.push({speed:5, x: player.x+.5*playerImage.width, y:player.y-missileImage.height, width:missileImage.width, height:missileImage.height});

		playSound(SOUND_SHOOT, .5);
	}

	function playSound(sound, volume) {

		var soundFound = false;
		var soundIndex = 0;
		var tempSound;

		if (soundPool.length > 0) {
			while (!soundFound && soundIndex < soundPool.length) {
				var tSound = soundPool[soundIndex];
				if ((tSound.element.ended || !tSound.played) && tSound.name == sound) {
					soundFound = true;
					tSound.played = true;
				} else {
					soundIndex++;
				}
			}
		}

		if (soundFound) {
			tempSound = soundPool[soundIndex].element;
			tempSound.volume = volume;
			tempSound.play();

		} else if (soundPool.length < MAX_SOUNDS){
			tempSound = document.createElement("audio");
			tempSound.setAttribute("src", sound + "." + audioType);
			tempSound.volume = volume;
			tempSound.play();
			soundPool.push({name:sound, element:tempSound, type:audioType, played:true});
		}
	}

	function run() {
		switch(appState) {
			case STATE_INIT:
				initApp();
				break;
			case STATE_LOADING:
				//wait for call backs
				break;
			case STATE_RESET:
				resetApp();
				break;
			case STATE_PLAYING:
				drawScreen();
				break;
			case STATE_END:
				endApp();
				break;
		}
	}

	camvasForShooting.addEventListener("mouseup", eventMouseUp, false);
	camvasForShooting.addEventListener("mousemove", eventMouseMove, false);

	setInterval(run, 33);

}
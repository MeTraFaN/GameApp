let arr = new Array(42);
stage = new createjs.Stage("canvas");
stage.enableMouseOver(5000);
let body = document.querySelector('body');
const canvas = document.querySelector('canvas');
let sidebar = document.querySelector('.sidebar');
let canvascubes = document.getElementById('showboard');
let rolldice = document.getElementById('rolldice');
let rotateshape = document.getElementById('rotateshape');
let textturn = document.getElementById('textturn');
let texthint = document.getElementById('texthint');
let LeftScore = document.getElementsByClassName('playerOneScore')[0];
let RightScore = document.getElementsByClassName('playerTwoScore')[0];


const ctx = canvascubes.getContext('2d');

let diceTrown = false;
let playersBlocks = [{},{}];
let wichTurn, blockColor = '';

let stalkingBlock, instalationBlock;

let CWidth = 798;
let CHeight = 627;
let coursorX, coursorY = 0;
var socket = io();

let f,s;

sidebar.style.width = body.clientWidth - canvas.width - 100 + "px";
sidebar.style.height = canvas.height - 20 + "px";
sidebar.style.right = 50 + "px";

//creating a visual cubes

ctx.strokeRect(48,50,114,114);
ctx.strokeRect(210,50,114,114);

//end

socket.on('showerrore', function(massage){
	ShowErrore(massage);
});
socket.on('deleteerrore', function(){
	deleteElement(ErroreWindow);
});
socket.on('turn', function(turn, hint, id){
	if (turn[0] === 'N') {
		rolldice.addEventListener('click', rollDice, false);
		rotateshape.addEventListener('click', rotateShape, false);
		canvas.addEventListener('mousemove', mouseMoveOnCanvas, false);
	} else {
		rolldice.removeEventListener('click', rollDice, false);
		rotateshape.removeEventListener('click', rotateShape, false);
	}
	if (id === 0) {
		wichTurn = 0;
		blockColor = "blue";
	} else {
		wichTurn = 1;
		blockColor = "red";
	}
	textturn.innerHTML = turn;
	texthint.innerHTML = hint;
});

//mouseclick on canvas
canvas.addEventListener("mousedown", function(){
	if(typeof instalationBlock != "undefined"){
		playersBlocks[wichTurn][Object.keys(playersBlocks[wichTurn]).length] = new createjs.Shape();
		createRect(f,s, playersBlocks[wichTurn][Object.keys(playersBlocks[wichTurn]).length-1], blockColor, 1, 1, coursorX - coursorX % 19, coursorY - coursorY % 19);
		getACenterOfBlock(playersBlocks[wichTurn][Object.keys(playersBlocks[wichTurn]).length-1], 1, 0, 1);
		playersBlocks[wichTurn][Object.keys(playersBlocks[wichTurn]).length-1].addEventListener('mouseover', mouseOverBlocks);
		stage.removeChild(instalationBlock);
		stage.removeChild(stalkingBlock.text);
		stage.removeChild(stalkingBlock);
		stalkingBlock = undefined;
		instalationBlock = undefined;
		stage.update();
	}
	canvas.removeEventListener("mousemove", mouseMoveOnCanvas);
	diceTrown = false;
	ctx.clearRect(49,51,112,112);
	ctx.clearRect(211,51,112,112);
	socket.emit('endOfTurn', wichTurn, f, s,
		playersBlocks[wichTurn][Object.keys(playersBlocks[wichTurn]).length-1].x,
		playersBlocks[wichTurn][Object.keys(playersBlocks[wichTurn]).length-1].y,
	);
});
//end

//creating a notebook sheet
for (var i = 0; i < 42; i++){
	arr[i] = new Array(33);
	for (var j = 0; j < 33; j++) {
		arr[i][j] = new createjs.Shape();
		arr[i][j].graphics.beginStroke("#9FD0EB").drawRect(i*19, j*19, 19, 19);
		stage.addChild(arr[i][j]);
	}
}
let line = new createjs.Shape();
line.graphics.beginStroke("#EE2A2A").moveTo(0, 28 * 19).lineTo(42 * 19, 28 * 19);
stage.addChild(line);
stage.update();

//end//


const mouseOverBlocks = (evt) => {
	console.log('qweq');
	console.log(evt);
};

const mouseMoveOnCanvas = (evt) => {
	coursorX = evt.pageX;
	coursorY = evt.pageY;
	if(diceTrown){
		if(typeof stalkingBlock == "undefined"){ // обработчик изменения движения квадратов
			stalkingBlock = new createjs.Shape();
			instalationBlock = new createjs.Shape();
			createRect(f,s, stalkingBlock, blockColor, 0.75, 1);
			createRect(f,s, instalationBlock, blockColor, 1, 0);
		}
		else {
			getACenterOfBlock(stalkingBlock, 1, 0, 0, "1");
			if(typeof instalationBlock != "undefined")
				getACenterOfBlock(instalationBlock, 0, 1, 0, "2");
		}
	} else{ //нужно попросить бросить кубики

	}
};


function createRect(first, second, shape, color, alpha, text, cx, cy){
	if (cx && cy) {
		shape.x = cx;
		shape.y = cy;
	}
	else {
		shape.x = coursorX;
		shape.y = coursorY;
	}
	shape.graphics.beginStroke(color).drawRect(0, 0, 19 * first, 19 * second);
	shape.alpha = alpha;
	if(text){
		shape.text = new createjs.Text(first * second, "15px Arial",color);
		stage.addChild(shape.text);
	}
	stage.addChild(shape);
	stage.update();
}


function getACenterOfBlock(shape, text, forInstalation, instalated, qwe) {
	if (!forInstalation && !instalated){ //блок преследователь
		shape.x = coursorX;
		shape.y = coursorY;
	}
	else{
		if( coursorX > CWidth - f * 19 && coursorY > CHeight - (5+s-0.5) * 19){
			shape.x = CWidth - f * 19;
			shape.y = CHeight - (5+s) * 19;
		}
		else if(coursorY > CHeight - (5+s-0.5) * 19){ //значит курсор в поле канваса и не за красной линией
			shape.x = coursorX - coursorX % 19;
			shape.y = CHeight - (5+s) * 19;
		}
		else if(coursorX > CWidth - (f-0.5) * 19){
			shape.x = CWidth - f * 19;
			shape.y = coursorY - coursorY % 19;
		}
		else {
			shape.x = coursorX - coursorX % 19;
			shape.y = coursorY - coursorY % 19;
		}
	}

	if (text){
		if (f * s > 9){
			shape.text.x = (shape.x + (shape.x + f * 19)) / 2 - 8.5;
			shape.text.y = (shape.y + (shape.y + s * 19)) / 2 - 8.5;
		} else {
			if (f == 1 || s == 1) { //если один из кубиков показал 1
				if (f == 1 && s == 1){
					shape.text.x = shape.x + f * 4.25;
					shape.text.y = shape.y + s * 2;
				} else if(f == 1){
					shape.text.x = shape.x + f * 4.5;
					shape.text.y = (shape.y + (shape.y + s * 19)) / 2 - 8.5;
				} else{
					shape.text.x = (shape.x + (shape.x + f * 19)) / 2 - 5;
					shape.text.y = shape.y + s * 2;
				}
			}
			else { //2,2; 2,3; 2,4; 3,2; 3,3; 4,2
				shape.text.x = shape.x + f * 19 / 2 - 4.5;
				shape.text.y = shape.y + s * 19 / 2 - 7.5;
			}
		}
	}

	stage.update();
}


const rollDice = () => {
	if(!diceTrown){
		f = Math.round(Math.random() * (6 - 1) + 1);
		s = Math.round(Math.random() * (6 - 1) + 1);
		showCubes(48,50, f);
		showCubes(210,50, s);
		diceTrown = true;
	}
};

function rotateShape(){
	stage.removeChild(stalkingBlock);
	stage.removeChild(stalkingBlock.text);
	stage.removeChild(instalationBlock);
	stalkingBlock = undefined;
	instalationBlock = undefined;
	stalkingBlock = new createjs.Shape();
	instalationBlock = new createjs.Shape();
	createRect(s,f, stalkingBlock, blockColor, 0.75, 1);
	createRect(s,f, instalationBlock, blockColor, 1, 0);
	[f, s] = [s, f];
}
function showCubes(x,y,n) {
	ctx.clearRect(x+1, y+1, 112, 112);
	let array = new Array(3);
	array[0] = [];
	array[1] = [];
	array[2] = [];
	switch(n){
		case 1: array[1][1] = 1; break;
		case 2: array[0][2] = 1; array[2][0] = 1; break;
		case 3: array[0][2] = 1; array[1][1] = 1; array[2][0] = 1; break;
		case 4: array[0][0] = 1; array[0][2] = 1; array[2][0] = 1; array[2][2] = 1; break;
		case 5: array[0][0] = 1; array[0][2] = 1; array[1][1] = 1; array[2][0] = 1; array[2][2] = 1; break;
		case 6: array[0][0] = 1; array[0][2] = 1; array[1][0] = 1; array[1][2] = 1; array[2][0] = 1; array[2][2] = 1; break;
	}

	ctx.beginPath();
	for(let i = 0; i < 3; i++){
		for(let j = 0; j < 3; j++){
			if(array[i][j]){
				ctx.moveTo(x+23+34*j, y+23+34*i);
				ctx.arc(x+23+34*j, y+23+34*i, 12, 0, Math.PI*2);
			}
		}
	}
	ctx.fill();
	ctx.closePath();
}

socket.on('changeScore', (player, playerScore) => {
	player === 0 ? LeftScore.innerHTML = playerScore : RightScore.innerHTML = playerScore;
});

socket.on('drawEnemyBlock', (player, f, s, x, y) => {
	console.log()
	createRect(f,s, playersBlocks[player][Object.keys(playersBlocks[player]).length-1], blockColor, 1, 1, x, y);
});

// нужно написать, чтобы блоки ренедерелись на сервере и переписать пол логики ((9

// написать ограничения, чтобы при наведении на существующий блок блок для устновки обтекал его
//  - при установки блока ставить на него ивент листенер mouseover и проверять, если мышка зашла
//    на существующий блок, значит высчитывать координаты coursorX & coursorY с погрешностью ширины
//    и высоты этого блока. Если блок первого игрока - значит х и у блока для установки будет больше
//    х и у на ширину блока, на который навели. Если же блок второго игрока - значит блок для установки
//    будет иметь х и у меньше, чем координаты наведенного блока на высоту и ширину этого блока. всв

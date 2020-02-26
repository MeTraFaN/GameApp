var canvas, LeftScore, RightScore, FPlayer, SPlayer;
var leftcounter = 0;
var rightcounter = 0;
var delta = [ 0, 0 ];
var stage = [ window.screenX, window.screenY, window.innerWidth, window.innerHeight ];


var LeftSide, RightSide;
var socket = io();

function init() {

	canvas = document.getElementById('canvas');
	LeftScore = document.getElementById('left');
	RightScore = document.getElementById('right');

}

function Score(value){
	if( value == 'left'){
		LeftScore.innerHTML = leftcounter = leftcounter += 1;

	}
	else {
		RightScore.innerHTML = rightcounter = rightcounter += 1;

	}

}

function ShowErrore(first){
	ErroreWindow = document.createElement('div');
	ErroreWindow.className = "ErroreWindow";
	ErroreWindow.innerHTML = first;
	document.body.appendChild(ErroreWindow);
}

function deleteElement(Element){
  //setTimeout(function(){ 
    document.body.removeChild(Element)
    //},2500);
};

//







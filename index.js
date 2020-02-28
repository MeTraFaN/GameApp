const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 4000;

let players = {};
const playersBlocks = [{},{}];

app.get('/main.css', function(req, res){
  res.sendFile(__dirname + '/public/stylesheets/main.css');
});
app.get('/main.js', function(req,res){
  res.sendFile(__dirname + '/js/main.js');
});
app.get('/second.js', function(req, res){
  res.sendFile(__dirname + '/js/second.js');
});
app.get('/app', function(req, res){
  res.sendFile(__dirname + '/days/app.html');
});

function user(id, textid){
  this.id = id;
  this.textid = textid;
  this.score = 0;
}

io.on('connection', function(client) {
  if(Object.keys(players).length == 0){
    players[Object.keys(players).length] = new user(0,client.id);
    client.emit('showerrore', "Welcome. The game will start after connecting the second user.");
  }
  else if(Object.keys(players).length == 1){

    players[Object.keys(players).length] = new user(1,client.id);
    if(typeof players[0] != "undefined"){
      io.sockets.connected[players[0].textid].emit('deleteerrore','');
      io.sockets.connected[players[0].textid].emit('turn', "Now your turn", "You need roll the dice", players[0].id);
    }
    client.emit('turn', "Your opponent turn", "Wait until it`s end.", );
  }
  else {
    players[Object.keys(players).length] = new user(2,client.id);
    client.emit('showerrore', "We apologize, but the Board is busy. Wait until one of the players leaves the game.");
  }


  client.on('endOfTurn', (player, f, s, x, y) => {
    let diferentPlayer;
    players[player].score += f*s;

    player === 0 ? diferentPlayer = 1 : diferentPlayer = 0;
    io.sockets.connected[players[diferentPlayer].textid].emit('drawEnemyBlock', player, f, s, x, y);
    io.sockets.connected[players[diferentPlayer].textid].emit('turn', "Now your turn", "You need roll the dice", diferentPlayer);
    io.sockets.connected[players[player].textid].emit('turn', "Your opponent turn", "Wait until it`s end.", player);

    client.broadcast.emit('changeScore', player, players[player].score);
    client.emit('changeScore', player, players[player].score);
  });

  client.on('disconnect', function () {
    for(let userid in players){
      if(players[userid].textid === client.id){
        delete players[userid];
      }
    }
  });
});




http.listen(port, function(){
  console.log('listening on *:' + port);
});

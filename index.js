var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var universe = {
  ships: []
}

function tick() {
}

function removeShip(id) {
  for(var i = 0; i < universe.ships.length; i++) {
    if(universe.ships[i].id == id)
    {
      universe.ships.splice(i, 1);
      return true;
    }
  }
  return false;
}

function replaceShip(id, newship) {
  for(var i = 0; i < universe.ships.length; i++) {
    if(universe.ships[i].id == id)
    {
      universe.ships.splice(i, 1, newship);
      return;
    }
  }
}

setInterval(tick, 17);

io.on('connection', function(socket){
  console.log('user connected');

  var clientShip = {
    id: socket.id,
    name: "Joe",
    color: "#"+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6),
    xPos: 0,
    yPos: 0,
    theta: Math.random() * 360,
    linVel: 0,
    rotVel: 0
  }

  universe.ships.push(clientShip);

  io.emit('universe', universe);

  socket.on('update', function(rec){
    replaceShip(socket.id, rec);
    io.emit('universe', universe);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    console.log(removeShip(socket.id) ? "clean" : "dirty");
  });
});

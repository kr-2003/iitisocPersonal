var express = require("express");
var app = express();
app.use(express.static("public"));
const port = process.env.PORT || 3000;
var http = require("http").createServer(app);
var io = require("socket.io")(http);

http.listen(port);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

var players = {},
  unmatched;

io.sockets.on("connection", function (socket) {
  console.log("socket connected");
  socket.emit("connects", { msg: "hello" });
  joinGame(socket);

  if (getOpponent(socket)) {
    socket.emit("game.begin", {
      symbol: players[socket.id].color,
    });
    getOpponent(socket).emit("game.begin", {
      symbol: players[getOpponent(socket).id].color,
    });
  }

  socket.on("make.move", function (data) {
    console.log(data);
    console.log(getOpponent(socket));
    if (!getOpponent(socket)) {
      return;
    }
    socket.emit("move.made", data);
    getOpponent(socket).emit("move.made", data);
  });

  socket.on("disconnect", function () {
    if (getOpponent(socket)) {
      getOpponent(socket).emit("opponent.left");
    }
  });
});

function joinGame(socket) {
  console.log(socket.id);
  players[socket.id] = {
    opponent: unmatched,

    color: "red",
    // The socket that is associated with this player
    socket: socket,
  };
  if (unmatched) {
    players[socket.id].color = "yellow";
    players[unmatched].opponent = socket.id;
    unmatched = null;
  } else {
    unmatched = socket.id;
  }
}

function getOpponent(socket) {
  if (!players[socket.id].opponent) {
    return;
  }
  return players[players[socket.id].opponent].socket;
}

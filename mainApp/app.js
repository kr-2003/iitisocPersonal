import express from "express";
import { rmSync } from "fs";
let app = express();
import mongoose from "mongoose";
import path from "path";
const __dirname = path.resolve();
import methodOverride from "method-override";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import ejsMate from "ejs-mate";
import { User } from "./models/user.js";
// import { Blog } from "./models/blog.js";
import { captureRejectionSymbol } from "events";
import ExpressError from "./utils/ExpressError.js";
import catchAsync from "./utils/ExpressError.js";
import { Server } from "socket.io";
const PORT = 3000;
const server = express()
  .use(app)
  .listen(PORT, () => console.log(`Listening Socket on ${PORT}`));
const io = new Server(server);
import ttt_game_logic from "./gamelogics/ttt_game_logic.js";
import c4_game_logic from "./gamelogics/c4_game_logic.js";

mongoose
  .connect("mongodb://localhost:27017/onlineGames")
  .then(() => {
    console.log("Mongo Connection done");
  })
  .catch((err) => {
    console.log("oh no mongo connection error!!!");
    console.log(err);
  });

const sessionConfig = {
  secret: "thisshouldbebettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
// app.set('views', './src/views');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
let currentUser;
app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get(
  "/",
  catchAsync(async (req, res) => {
    res.render(__dirname + "/views/index.ejs");
  })
);

// io.sockets.on("connection", function (socket) {
//   console.log("lorem ipsum");
//   socket.on("join", function (data) {
//     console.log(data);
//   });
// });
app.get(
  "/tictactoe",
  catchAsync(async (req, res) => {
    if (req.user !== undefined) {
      res.writeHead(302, {
        Location: "/tictactoe/" + generateHash(6),
      });
      res.end();
    } else {
      req.flash("error", "Need to login/signup first!!");
      res.redirect(`/login`);
    }
  })
);

app.get("/tictactoe/:room([A-Za-z0-9]{6})", function (req, res) {
  if (req.user !== undefined) res.render("tictactoe.ejs");
  else {
    req.flash("error", "Need to login/signup first!!");
    res.redirect(`/login`);
  }
});

app.get(
  "/connect4",
  catchAsync(async (req, res) => {
    res.writeHead(302, {
      Location: "/connect4/" + generateHash(6),
    });
    res.end();
  })
);

app.get("/connect4/:room([A-Za-z0-9]{6})", function (req, res) {
  res.render("connect4.ejs");
});

function generateHash(length) {
  var haystack =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    output = "";
  for (var i = 0; i < length; i++) {
    output += haystack.charAt(Math.floor(Math.random() * haystack.length));
  }
  return output;
}

var rooms = [];

io.sockets.on("connection", function (socket) {
  socket.on("joinTicTacToe", function (data) {
    if (data.room in ttt_game_logic.games) {
      var game = ttt_game_logic.games[data.room];
      if (typeof game.player2 != "undefined") {
        return;
      }
      console.log("player 2 logged on");
      socket.join(data.room);
      rooms.push(data.room);
      socket.room = data.room;
      socket.pid = 2;
      socket.hash = generateHash(8);
      game.player2 = socket;
      game.player2Username = currentUser.username;
      socket.opponent = game.player1;
      game.player1.opponent = socket;
      socket.emit("assign", { pid: socket.pid, hash: socket.hash });
      game.turn = 1;
      socket.broadcast.to(data.room).emit("start");
    } else {
      console.log("player 1 is here");
      if (rooms.indexOf(data.room) <= 0) socket.join(data.room);
      socket.room = data.room;
      socket.pid = 1;
      socket.hash = generateHash(8);
      ttt_game_logic.games[data.room] = {
        player1: socket,
        player1Username: currentUser.username,
        moves: 0,
        board: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
      };
      rooms.push(data.room);
      socket.emit("assign", { pid: socket.pid, hash: socket.hash });
    }

    socket.on("makeMove", function (data) {
      var game = ttt_game_logic.games[socket.room];
      if ((data.hash = socket.hash && game.turn == socket.pid)) {
        var move_made = ttt_game_logic.make_move(
          socket.room,
          data.col,
          data.row,
          socket.pid
        );
        if (move_made) {
          game.moves = parseInt(game.moves) + 1;
          socket.broadcast.to(socket.room).emit("move_made", {
            pid: socket.pid,
            col: data.col,
            row: data.row,
          });
          game.turn = socket.opponent.pid;
          var winner = ttt_game_logic.check_for_win(game.board);
          // console.log(game.username);
          // console.log(game.board);
          if (winner) {
            io.to(socket.room).emit("winner", { winner: winner });
            console.log(winner.winner);
            console.log(game.player1Username);
            console.log(game.player2Username);
            if (winner.winner == 1) {
              history(
                "won",
                "tictactoe",
                game.player1Username,
                game.player2Username
              );
            } else {
              history(
                "won",
                "tictactoe",
                game.player2Username,
                game.player1Username
              );
            }

            // io.to(socket.room).emit("stop");

            // socket.send('winner', {winner: winner});
          }
          if (game.moves >= 9 && !winner) {
            io.to(socket.room).emit("draw");
            history(
              "draw",
              "tictactoe",
              game.player1Username,
              game.player2Username
            );
            // socket.send('draw');
          }
        }
      }
    });

    socket.on("my_move", function (data) {
      socket.broadcast
        .to(socket.room)
        .emit("opponent_move", { col: data.col, row: data.row });
    });

    socket.on("disconnect", function () {
      if (socket.room in ttt_game_logic.games) {
        delete ttt_game_logic.games[socket.room];
        io.to(socket.room).emit("stop");
        // socket.send('stop');
        console.log("room closed: " + socket.room);
      } else {
        console.log("disconnect called but nothing happend");
      }
      // implement remove room
    });
  });

  socket.on("joinConnect4", function (data) {
    if (data.room in c4_game_logic.games) {
      var game = c4_game_logic.games[data.room];
      if (typeof game.player2 != "undefined") {
        return;
      }
      console.log("player 2 logged on");
      socket.join(data.room);
      rooms.push(data.room);
      socket.room = data.room;
      socket.pid = 2;
      socket.hash = generateHash(8);
      game.player2 = socket;
      game.player2Username = currentUser.username;
      socket.opponent = game.player1;
      game.player1.opponent = socket;
      socket.emit("assign", { pid: socket.pid, hash: socket.hash });
      game.turn = 1;
      socket.broadcast.to(data.room).emit("start");
    } else {
      console.log("player 1 is here");
      if (rooms.indexOf(data.room) <= 0) socket.join(data.room);
      socket.room = data.room;
      socket.pid = 1;
      socket.hash = generateHash(8);
      c4_game_logic.games[data.room] = {
        player1: socket,
        player1Username: currentUser.username,
        moves: 0,
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
        ],
      };
      rooms.push(data.room);
      socket.emit("assign", { pid: socket.pid, hash: socket.hash });
    }

    socket.on("makeMove", function (data) {
      var game = c4_game_logic.games[socket.room];
      if ((data.hash = socket.hash && game.turn == socket.pid)) {
        var move_made = c4_game_logic.make_move(
          socket.room,
          data.col,
          socket.pid
        );
        if (move_made) {
          game.moves = parseInt(game.moves) + 1;
          socket.broadcast
            .to(socket.room)
            .emit("move_made", { pid: socket.pid, col: data.col });
          game.turn = socket.opponent.pid;
          var winner = c4_game_logic.check_for_win(game.board);
          if (winner) {
            io.to(socket.room).emit("winner", { winner: winner });
            // socket.send("winner", { winner: winner });
            console.log(winner.winner);
            console.log(game.player1Username);
            console.log(game.player2Username);
            if (winner.winner == 1) {
              history(
                "won",
                "connect4",
                game.player1Username,
                game.player2Username
              );
            } else {
              history(
                "won",
                "connect4",
                game.player2Username,
                game.player1Username
              );
            }
          }
          if (game.moves >= 42) {
            io.to(socket.room).emit("draw");
            history(
              "draw",
              "connect4",
              game.player1Username,
              game.player2Username
            );
            // socket.send("draw");
          }
        }
      }
    });

    socket.on("my_move", function (data) {
      socket.broadcast.to(socket.room).emit("opponent_move", { col: data.col });
    });

    socket.on("disconnect", function () {
      if (socket.room in c4_game_logic.games) {
        delete c4_game_logic.games[socket.room];
        io.to(socket.room).emit("stop");
        // socket.send("stop");
        console.log("room closed: " + socket.room);
      } else {
        console.log("disconnect called but nothing happend");
      }
      // implement remove room
    });
  });
});

const history = async (status, game, winner, loser) => {
  console.log(status, game, winner, loser);
  const player1 = await User.findOne({ username: winner.toString() });
  const player2 = await User.findOne({ username: loser.toString() });
  player1.history.push({
    game: game,
    status: status,
    winner: winner,
    loser: loser,
  });
  await player1.save();
  player2.history.push({
    game: game,
    status: status,
    winner: winner,
    loser: loser,
  });
  await player2.save();
};

app.get(
  "/users/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const user = await User.findById(id).populate({ path: "followers" });
    console.log(id);
    console.log(user);
    if (!user) {
      req.flash("error", "Cannot find the user!!");
      return res.redirect("/");
    }
    console.log(user);
    console.log(req.user);
    res.render("profile.ejs", { user });
  })
);

app.get(
  "/users/:id/follow",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (req.user && user !== req.user.username) {
      user.followers.push(req.user);
    }
    await user.save();
    req.flash("success", "Added a follower!!!");
    res.redirect(`/users/${id}`);
  })
);

app.get(
  "/users/:id/:followerId/unfollow",
  catchAsync(async (req, res) => {
    const { id, followerId } = req.params;
    await User.findByIdAndUpdate(followerId, { $pull: { followers: id } });
    req.flash("success", "Unfollowed!");
    res.redirect(`/users/${followerId}`);
  })
);

app.get(
  "/register",
  catchAsync(async (req, res) => {
    res.render("register.ejs");
  })
);

app.get(
  "/login",
  catchAsync(async (req, res) => {
    res.render("login.ejs");
  })
);

app.get(
  "/logout",
  catchAsync(async (req, res) => {
    req.logout(function (err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      req.flash("success", "Goodbye!!");
      res.redirect("/");
    });
  })
);

app.get(
  "/games",
  catchAsync(async (req, res) => {
    res.render("games.ejs");
  })
);

app.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const user = new User({
        email: req.body.email,
        username: req.body.username,
      });
      const newUser = await User.register(user, req.body.password);
      req.login(newUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Successfully signed up!!");
        res.redirect("/login");
      });
    } catch (err) {
      // console.log(err.message);
      req.flash("error", "Something went wrong!");
      res.redirect("/register");
    }
  })
);

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/",
  }),
  catchAsync(async (req, res) => {
    req.flash("success", "Welcome Back!!!");
    // const redirectUrl = req.session.returnTo || "/";
    res.redirect("/login");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!!" } = err;
  if (!err.message) err.message = "Something went wrong!!";
  console.log(err.message);
  res.status(statusCode).render("error", { err });
});

// app.listen(3000, function () {
//   console.log("heloe");
// });

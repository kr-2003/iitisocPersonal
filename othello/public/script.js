let playerBlack = "B";
let playerWhite = "W";
let currPlayer = playerBlack;
let gameOver = false;
const rows = 8;
const cols = 8;
let board;
let coord = [];

window.onload = function () {
  setGame();
  playGame();
};

function setGame() {
  board = [];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(" ");

      let tile = document.createElement("button");
      //   tile.id = r.toString() + "-" + c.toString()
      tile.classList.add("tile");
      document.querySelector("#board").append(tile);
      let circ = document.createElement("button");
      circ.id = r.toString() + "-" + c.toString();
      circ.classList.add("btn");
      tile.append(circ);
    }
    board.push(row);
  }
  document.getElementById("3-3").classList.add("whitePiece");
  document.getElementById("3-4").classList.add("blackPiece");
  document.getElementById("4-4").classList.add("whitePiece");
  document.getElementById("4-3").classList.add("blackPiece");
  board[3][3] = "W";
  board[3][4] = "B";
  board[4][4] = "W";
  board[4][3] = "B";
}

function playGame() {
  if (currPlayer === "B") {
    checkBlack();
    coord.forEach((pnt) => {
      document
        .getElementById(pnt.i.toString() + "-" + pnt.j.toString())
        .classList.add("blackHint");
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        document
          .getElementById(r.toString() + "-" + c.toString())
          .addEventListener("click", () => {
            if (
              document
                .getElementById(r.toString() + "-" + c.toString())
                .classList.contains("blackHint")
            ) {
              document
                .getElementById(r.toString() + "-" + c.toString())
                .classList.add("blackPiece");
              board[r][c] = "B";
              coord.forEach((pnt) => {
                document
                  .getElementById(pnt.i.toString() + "-" + pnt.j.toString())
                  .classList.remove("blackHint");
              });
              coord = [];
              currPlayer = "W";
              playGame();
            }
          });
      }
    }
  } else {
    checkWhite();
    coord.forEach((pnt) => {
      document
        .getElementById(pnt.i.toString() + "-" + pnt.j.toString())
        .classList.add("whiteHint");
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        document
          .getElementById(r.toString() + "-" + c.toString())
          .addEventListener("click", () => {
            if (
              document
                .getElementById(r.toString() + "-" + c.toString())
                .classList.contains("whiteHint")
            ) {
              document
                .getElementById(r.toString() + "-" + c.toString())
                .classList.add("whitePiece");
              board[r][c] = "W";
              coord.forEach((pnt) => {
                document
                  .getElementById(pnt.i.toString() + "-" + pnt.j.toString())
                  .classList.remove("whiteHint");
              });
              coord = [];
              currPlayer = "B";
              playGame();
            }
          });
      }
    }
  }
}

function checkBlack() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === "B") {
        vertical(r, c);
        horizontal(r, c);
      }
    }
  }
}

function checkWhite() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === "W") {
        vertical(r, c);
        horizontal(r, c);
      }
    }
  }
}

function vertical(i, j) {
  let r;
  for (r = i + 1; r < rows; r++) {
    if (currPlayer === "B") {
      if (board[r][j] != "W") break;
    } else {
      if (board[r][j] != "B") break;
    }
  }
  if (r !== i + 1) coord.push({ i: r, j: j });
  for (r = i - 1; r >= 0; r--) {
    if (currPlayer === "B") {
      if (board[r][j] != "W") break;
    } else {
      if (board[r][j] != "B") break;
    }
  }
  if (r !== i - 1) coord.push({ i: r, j: j });
}

function horizontal(i, j) {
  let c;
  for (c = j + 1; c < cols; c++) {
    if (currPlayer === "B") {
      if (board[i][c] != "W") break;
    } else {
      if (board[i][c] != "B") break;
    }
  }
  if (c !== j + 1) coord.push({ i: i, j: c });
  for (c = j - 1; c >= 0; c--) {
    if (currPlayer === "B") {
      if (board[i][c] != "W") break;
    } else {
      if (board[i][c] != "B") break;
    }
  }
  if (c !== j - 1) coord.push({ i: i, j: c });
}

let playerBlack = "B";
let playerWhite = "W";
let currPlayer = playerBlack;
let gameOver = false;
const rows = 8;
const cols = 8;
let board;
let coord = [];
let coord2 = [];

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
    console.log(coord);
    checkBlack();
    coord.forEach((pnt) => {
      if (document.getElementById(pnt.i.toString() + "-" + pnt.j.toString()))
        document
          .getElementById(pnt.i.toString() + "-" + pnt.j.toString())
          .classList.add("blackHint");
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let btn = document.getElementById(r.toString() + "-" + c.toString());
        btn.addEventListener("click", () => {
          if (btn.classList.contains("blackHint")) {
            coord.forEach((pnt) => {
              if (
                document.getElementById(
                  pnt.i.toString() + "-" + pnt.j.toString()
                )
              )
                document
                  .getElementById(pnt.i.toString() + "-" + pnt.j.toString())
                  .classList.remove("blackHint");
            });
            coord = [];
            console.log({ r, c });
            fillVertical(r, c);
            fillHorizontal(r, c);
            fillDiagonal(r, c);
            currPlayer = "W";
            playGame();
          }
        });
      }
    }
  } else {
    console.log(coord);
    checkWhite();
    coord.forEach((pnt) => {
      if (document.getElementById(pnt.i.toString() + "-" + pnt.j.toString()))
        document
          .getElementById(pnt.i.toString() + "-" + pnt.j.toString())
          .classList.add("whiteHint");
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let btn = document.getElementById(r.toString() + "-" + c.toString());
        btn.addEventListener("click", () => {
          if (btn.classList.contains("whiteHint")) {
            coord.forEach((pnt) => {
              if (
                document.getElementById(
                  pnt.i.toString() + "-" + pnt.j.toString()
                )
              )
                document
                  .getElementById(pnt.i.toString() + "-" + pnt.j.toString())
                  .classList.remove("whiteHint");
            });
            coord = [];
            console.log({ r, c });

            fillVertical(r, c);
            fillHorizontal(r, c);
            fillDiagonal(r, c);
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
        diagonal(r, c);
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
        diagonal(r, c);
      }
    }
  }
}

function vertical(i, j) {
  let r;
  for (r = i + 1; r < rows; r++) {
    if (currPlayer === "B") {
      if (board[r][j] === "W") continue;
      else break;
    } else {
      if (board[r][j] === "B") continue;
      else break;
    }
  }
  if (r !== i + 1) {
    coord.push({ i: r, j: j });
  }
  for (r = i - 1; r >= 0; r--) {
    if (currPlayer === "B") {
      if (board[r][j] === "W") continue;
      else break;
    } else {
      if (board[r][j] === "B") continue;
      else break;
    }
  }
  if (r !== i - 1) coord.push({ i: r, j: j });
}

function horizontal(i, j) {
  let c;
  for (c = j + 1; c < cols; c++) {
    if (currPlayer === "B") {
      if (board[i][c] === "W") continue;
      else break;
    } else {
      if (board[i][c] === "B") continue;
      else break;
    }
  }
  if (c !== j + 1) coord.push({ i: i, j: c });
  for (c = j - 1; c >= 0; c--) {
    if (currPlayer === "B") {
      if (board[i][c] === "W") continue;
      else break;
    } else {
      if (board[i][c] === "B") continue;
      else break;
    }
  }
  if (c !== j - 1) coord.push({ i: i, j: c });
}

function diagonal(i, j) {
  let r = i;
  let c = j;
  while (r < rows && c < cols) {
    r++;
    c++;
    if (r >= rows || c >= cols) break;
    if (currPlayer === "B") {
      if (board[r][c] === "W") continue;
      else break;
    } else {
      if (board[r][c] === "B") continue;
      else break;
    }
  }
  if (c !== j + 1) coord.push({ i: r, j: c });
  (r = i), (c = j);
  while (r < rows && c >= 0) {
    r++;
    c--;
    if (r >= rows || c < 0) break;
    if (currPlayer === "B") {
      if (board[r][c] === "W") continue;
      else break;
    } else {
      if (board[r][c] === "B") continue;
      else break;
    }
  }
  if (c !== j - 1) coord.push({ i: r, j: c });
  (r = i), (c = j);
  while (r >= 0 && c >= 0) {
    r--;
    c--;
    if (r < 0 || c < 0) break;

    if (currPlayer === "B") {
      if (board[r][c] === "W") continue;
      else break;
    } else {
      if (board[r][c] === "B") continue;
      else break;
    }
  }
  if (c !== j - 1) coord.push({ i: r, j: c });
  (r = i), (c = j);
  while (r >= 0 && c < cols) {
    r--;
    c++;
    if (r < 0 || c >= cols) break;
    if (currPlayer === "B") {
      if (board[r][c] === "W") continue;
      else break;
    } else {
      if (board[r][c] === "B") continue;
      else break;
    }
  }
  if (c !== j + 1) coord.push({ i: r, j: c });
}

function fillVertical(i, j) {
  let r;
  ans = false;
  for (r = i + 1; r < rows; r++) {
    if (currPlayer === "B") {
      if (board[r][j] === "B") {
        ans = true;
        break;
      } else if (board[r][j] === "W") continue;
      else {
        break;
      }
    }
    if (currPlayer === "W") {
      if (board[r][j] === "W") {
        ans = true;
        break;
      } else if (board[r][j] === "B") continue;
      else {
        break;
      }
    }
  }
  if (ans) {
    while (r >= i) {
      let btn = document.getElementById(r.toString() + "-" + j.toString());
      if (currPlayer === "B") {
        btn.classList.add("blackPiece");
        board[r][j] = "B";
        if (btn.classList.contains("whitePiece"))
          btn.classList.remove("whitePiece");
      } else {
        btn.classList.add("whitePiece");
        board[r][j] = "W";
        if (btn.classList.contains("blackPiece"))
          btn.classList.remove("blackPiece");
      }
      r--;
    }
  }

  ans = false;
  for (r = i - 1; r >= 0; r--) {
    if (currPlayer === "B") {
      if (board[r][j] === "B") {
        ans = true;
        break;
      } else if (board[r][j] === "W") continue;
      else {
        break;
      }
    }
    if (currPlayer === "W") {
      if (board[r][j] === "W") {
        ans = true;
        break;
      } else if (board[r][j] === "B") continue;
      else {
        break;
      }
    }
  }
  if (ans) {
    while (r <= i) {
      let btn = document.getElementById(r.toString() + "-" + j.toString());
      if (currPlayer === "B") {
        btn.classList.add("blackPiece");
        board[r][j] = "B";
        if (btn.classList.contains("whitePiece"))
          btn.classList.remove("whitePiece");
      } else {
        btn.classList.add("whitePiece");
        board[r][j] = "W";
        if (btn.classList.contains("blackPiece"))
          btn.classList.remove("blackPiece");
      }
      r++;
    }
  }
}

function fillHorizontal(i, j) {
  let c;
  ans = false;
  for (c = j + 1; c < cols; c++) {
    if (currPlayer === "B") {
      if (board[i][c] === "B") {
        ans = true;
        break;
      } else if (board[i][c] === "W") continue;
      else {
        break;
      }
    }
    if (currPlayer === "W") {
      if (board[i][c] === "W") {
        ans = true;
        break;
      } else if (board[i][c] === "B") continue;
      else {
        break;
      }
    }
  }
  if (ans) {
    while (c >= j) {
      let btn = document.getElementById(i.toString() + "-" + c.toString());
      if (currPlayer === "B") {
        btn.classList.add("blackPiece");
        board[i][c] = "B";
        if (btn.classList.contains("whitePiece"))
          btn.classList.remove("whitePiece");
      } else {
        btn.classList.add("whitePiece");
        board[i][c] = "W";
        if (btn.classList.contains("blackPiece"))
          btn.classList.remove("blackPiece");
      }
      c--;
    }
  }

  ans = false;
  for (c = j - 1; c >= 0; c--) {
    if (currPlayer === "B") {
      if (board[i][c] === "B") {
        ans = true;
        break;
      } else if (board[i][c] === "W") continue;
      else {
        break;
      }
    }
    if (currPlayer === "W") {
      if (board[i][c] === "W") {
        ans = true;
        break;
      } else if (board[i][c] === "B") continue;
      else {
        break;
      }
    }
  }
  if (ans) {
    while (c <= j) {
      let btn = document.getElementById(i.toString() + "-" + c.toString());
      if (currPlayer === "B") {
        btn.classList.add("blackPiece");
        board[i][c] = "B";
        if (btn.classList.contains("whitePiece"))
          btn.classList.remove("whitePiece");
      } else {
        btn.classList.add("whitePiece");
        board[i][c] = "W";
        if (btn.classList.contains("blackPiece"))
          btn.classList.remove("blackPiece");
      }
      c++;
    }
  }
}

function fillDiagonal(i, j) {
  let r = i;
  let c = j;
  ans = false;
  while (r < rows && c < cols) {
    r++;
    c++;
    if (r >= rows || c >= cols) break;
    if (currPlayer === "B") {
      if (board[r][c] === "B") {
        ans = true;
        break;
      } else if (board[r][c] === "W") {
        continue;
      } else {
        break;
      }
    } else {
      if (board[r][c] === "W") {
        ans = true;
        break;
      } else if (board[r][c] === "B") {
        continue;
      } else {
        break;
      }
    }
  }
  if (ans) {
    while (r >= i && c >= j) {
      let btn = document.getElementById(r.toString() + "-" + c.toString());
      if (currPlayer === "B") {
        btn.classList.add("blackPiece");
        board[r][j] = "B";
        if (btn.classList.contains("whitePiece"))
          btn.classList.remove("whitePiece");
      } else {
        btn.classList.add("whitePiece");
        board[r][j] = "W";
        if (btn.classList.contains("blackPiece"))
          btn.classList.remove("blackPiece");
      }
      r--;
      c--;
    }
  }

  ans = false;
  (r = i), (c = j);
  while (r < rows && c >= 0) {
    r++;
    c--;
    if (r >= rows || c < 0) break;
    if (currPlayer === "B") {
      if (board[r][c] === "B") {
        ans = true;
        break;
      } else if (board[r][c] === "W") {
        continue;
      } else {
        break;
      }
    } else {
      if (board[r][c] === "W") {
        ans = true;
        break;
      } else if (board[r][c] === "B") {
        continue;
      } else {
        break;
      }
    }
  }
  if (ans) {
    while (r >= i && c <= j) {
      let btn = document.getElementById(r.toString() + "-" + c.toString());
      if (currPlayer === "B") {
        btn.classList.add("blackPiece");
        board[r][j] = "B";
        if (btn.classList.contains("whitePiece"))
          btn.classList.remove("whitePiece");
      } else {
        btn.classList.add("whitePiece");
        board[r][j] = "W";
        if (btn.classList.contains("blackPiece"))
          btn.classList.remove("blackPiece");
      }
      r--;
      c++;
    }
  }
  (r = i), (c = j);
  ans = false;
  while (r >= 0 && c >= 0) {
    r--;
    c--;
    if (r < 0 || c < 0) break;
    if (currPlayer === "B") {
      if (board[r][c] === "B") {
        ans = true;
        break;
      } else if (board[r][c] === "W") {
        continue;
      } else {
        break;
      }
    } else {
      if (board[r][c] === "W") {
        ans = true;
        break;
      } else if (board[r][c] === "B") {
        continue;
      } else {
        break;
      }
    }
  }
  if (ans) {
    while (r <= i && c <= j) {
      let btn = document.getElementById(r.toString() + "-" + c.toString());
      if (currPlayer === "B") {
        btn.classList.add("blackPiece");
        board[r][j] = "B";
        if (btn.classList.contains("whitePiece"))
          btn.classList.remove("whitePiece");
      } else {
        btn.classList.add("whitePiece");
        board[r][j] = "W";
        if (btn.classList.contains("blackPiece"))
          btn.classList.remove("blackPiece");
      }
      r++;
      c++;
    }
  }
  (r = i), (c = j);
  ans = false;
  while (r >= 0 && c < cols) {
    r--;
    c++;
    if (r < 0 || c >= cols) break;
    if (currPlayer === "B") {
      if (board[r][c] === "B") {
        ans = true;
        break;
      } else if (board[r][c] === "W") {
        continue;
      } else {
        break;
      }
    } else {
      if (board[r][c] === "W") {
        ans = true;
        break;
      } else if (board[r][c] === "B") {
        continue;
      } else {
        break;
      }
    }
  }
  if (ans) {
    while (r <= i && c >= j) {
      let btn = document.getElementById(r.toString() + "-" + c.toString());
      if (currPlayer === "B") {
        btn.classList.add("blackPiece");
        board[r][j] = "B";
        if (btn.classList.contains("whitePiece"))
          btn.classList.remove("whitePiece");
      } else {
        btn.classList.add("whitePiece");
        board[r][j] = "W";
        if (btn.classList.contains("blackPiece"))
          btn.classList.remove("blackPiece");
      }
      r++;
      c--;
    }
  }
}

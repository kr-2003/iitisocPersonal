let playerRed = "R";
let playerYellow = "Y";
let currPlayer = playerRed;
let gameOver = false;
const rows = 6;
const cols = 7;
let board;

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
      tile.id = r.toString() + "-" + c.toString();
      tile.classList.add("tile");
      document.querySelector("#board").append(tile);
    }
    board.push(row);
  }
}

function playGame() {
  let tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      console.log(tile.id);
      changeColor(tile);
      checkRow();
      checkColumn();
      checkDiag();
    });
  });
}

function changeColor(tile) {
  let col = tile.id[2];
  for (let r = 5; r >= 0; r--) {
    if (currPlayer == playerRed) {
      if (
        !document
          .getElementById(r + "-" + col)
          .classList.contains("redPiece") &&
        !document
          .getElementById(r + "-" + col)
          .classList.contains("yellowPiece")
      ) {
        document.getElementById(r + "-" + col).classList.add("redPiece");
        currPlayer = playerYellow;
        break;
      }
    } else {
      if (
        !document
          .getElementById(r + "-" + col)
          .classList.contains("redPiece") &&
        !document
          .getElementById(r + "-" + col)
          .classList.contains("yellowPiece")
      ) {
        document.getElementById(r + "-" + col).classList.add("yellowPiece");
        currPlayer = playerRed;
        break;
      }
    }
  }
}

function checkRow() {
  for (let c = 0; c < cols; c++) {
    for (let r = rows - 1; r >= 3; r--) {
      if (document.getElementById(r + "-" + c).classList.contains("redPiece")) {
        let ans = true;
        for (let rs = r; rs >= r - 3; rs--) {
          if (
            !document
              .getElementById(rs + "-" + c)
              .classList.contains("redPiece")
          ) {
            ans = false;
            break;
          }
        }
        if (ans) {
          console.log("red wins");
        }
      } else if (
        document.getElementById(r + "-" + c).classList.contains("yellowPiece")
      ) {
        let ans = true;
        for (let rs = r; rs >= r - 3; rs--) {
          if (
            !document
              .getElementById(rs + "-" + c)
              .classList.contains("yellowPiece")
          ) {
            ans = false;
            break;
          }
        }
        if (ans) {
          console.log("yellow wins");
        }
      }
    }
  }
}

function checkColumn() {
  for (let r = 0; r < rows; r++) {
    for (let c = cols - 1; c >= 3; c--) {
      if (document.getElementById(r + "-" + c).classList.contains("redPiece")) {
        let ans = true;
        for (let cs = c; cs >= c - 3; cs--) {
          if (
            !document
              .getElementById(r + "-" + cs)
              .classList.contains("redPiece")
          ) {
            ans = false;
            break;
          }
        }
        if (ans) {
          console.log("red wins");
        }
      } else if (
        document.getElementById(r + "-" + c).classList.contains("yellowPiece")
      ) {
        let ans = true;
        for (let cs = c; cs >= c - 3; cs--) {
          if (
            !document
              .getElementById(r + "-" + cs)
              .classList.contains("yellowPiece")
          ) {
            ans = false;
            break;
          }
        }
        if (ans) {
          console.log("yellow wins");
        }
      }
    }
  }
}

function checkDiag() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (document.getElementById(r + "-" + c).classList.contains("redPiece")) {
        let ans = 0;
        for (let i = 1; i <= 3; i++) {
          if (
            document.getElementById(
              (r - i).toString() + "-" + (c + i).toString()
            ) != null &&
            document
              .getElementById((r - i).toString() + "-" + (c + i).toString())
              .classList.contains("redPiece")
          ) {
            ans++;
          }
        }
        let ans2 = 0;
        for (let i = 1; i <= 3; i++) {
          if (
            document.getElementById(
              (r - i).toString() + "-" + (c - i).toString()
            ) != null &&
            document
              .getElementById((r - i).toString() + "-" + (c - i).toString())
              .classList.contains("redPiece")
          ) {
            ans2++;
          }
        }
        if (ans == 3 || ans2 == 3) {
          console.log("red wins");
        }
      } else if (
        document.getElementById(r + "-" + c).classList.contains("yellowPiece")
      ) {
        let ans = 0;
        for (let i = 1; i <= 3; i++) {
          if (
            document.getElementById(
              (r - i).toString() + "-" + (c + i).toString()
            ) != null &&
            document
              .getElementById((r - i).toString() + "-" + (c + i).toString())
              .classList.contains("yellowPiece")
          ) {
            ans++;
          }
        }
        let ans2 = 0;
        for (let i = 1; i <= 3; i++) {
          if (
            document.getElementById(
              (r - i).toString() + "-" + (c - i).toString()
            ) != null &&
            document
              .getElementById((r - i).toString() + "-" + (c - i).toString())
              .classList.contains("yellowPiece")
          ) {
            ans2++;
          }
        }
        if (ans == 3 || ans2 == 3) {
          console.log("yellow wins");
        }
      }
    }
  }
}

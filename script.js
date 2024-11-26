// //your code here

// function reset() {
//     for (i = 1; i <= 9; i++) {
//         const block = document.getElementById(`${i}`);
//         block.style.backgroundColor = "transparent";
//     }
// }
  
// document.getElementById('reset_button').addEventListener('click', reset);

// document.getElementById('change_button').addEventListener('click', () => {
//     // reset();
//     const blockId = document.getElementById("block_id").value;
//     const color = document.getElementById("colour_id").value;
//     // alert(colorId)
//     const block = document.getElementById(`${blockId}`);
//     block.style.backgroundColor = color;
// });

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("game-container");
    const resultDisplay = document.getElementById("result");
    const flagsLeftDisplay = document.getElementById("flagsLeft");

    const width = 10;
    const bombCount = 10;
    let flags = bombCount;
    let squares = [];
    let isGameOver = false;

    // Create the grid
    function createBoard() {
        const bombsArray = Array(bombCount).fill("bomb");
        const validArray = Array(width * width - bombCount).fill("valid");
        const gameArray = [...validArray, ...bombsArray].sort(() => Math.random() - 0.5);

        gameArray.forEach((type, i) => {
            const square = document.createElement("div");
            square.setAttribute("id", i);
            square.classList.add("cell", type);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener("click", () => handleLeftClick(square));
            square.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                handleRightClick(square);
            });
        });

        // Add bomb counts
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains("bomb")) continue;

            let total = 0;
            const isLeftEdge = i % width === 0;
            const isRightEdge = i % width === width - 1;

            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++;
            if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++;
            if (i > 10 && squares[i - width].classList.contains("bomb")) total++;
            if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb")) total++;
            if (i < 98 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++;
            if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")) total++;
            if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")) total++;
            if (i < 89 && squares[i + width].classList.contains("bomb")) total++;

            squares[i].setAttribute("data", total);
        }
    }

    // Handle left-click
    function handleLeftClick(square) {
        if (isGameOver || square.classList.contains("checked") || square.classList.contains("flag")) return;

        if (square.classList.contains("bomb")) {
            gameOver();
        } else {
            const total = square.getAttribute("data");
            square.classList.add("checked");
            square.innerHTML = total || "";
            if (!total) checkAdjacentSquares(square);
        }

        checkWin();
    }

    // Check adjacent squares for empty cells
    function checkAdjacentSquares(square) {
        const id = parseInt(square.id);
        const isLeftEdge = id % width === 0;
        const isRightEdge = id % width === width - 1;

        setTimeout(() => {
            if (id > 0 && !isLeftEdge) handleLeftClick(squares[id - 1]);
            if (id > 9 && !isRightEdge) handleLeftClick(squares[id + 1 - width]);
            if (id > 10) handleLeftClick(squares[id - width]);
            if (id > 11 && !isLeftEdge) handleLeftClick(squares[id - 1 - width]);
            if (id < 98 && !isRightEdge) handleLeftClick(squares[id + 1]);
            if (id < 90 && !isLeftEdge) handleLeftClick(squares[id - 1 + width]);
            if (id < 88 && !isRightEdge) handleLeftClick(squares[id + 1 + width]);
            if (id < 89) handleLeftClick(squares[id + width]);
        }, 10);
    }

    // Handle right-click
    function handleRightClick(square) {
        if (isGameOver || square.classList.contains("checked")) return;

        if (square.classList.contains("flag")) {
            square.classList.remove("flag");
            square.innerHTML = "";
            flags++;
        } else if (flags > 0) {
            square.classList.add("flag");
            square.innerHTML = "🚩";
            flags--;
        }

        flagsLeftDisplay.textContent = flags;
        checkWin();
    }

    // Game Over
    function gameOver() {
        isGameOver = true;
        resultDisplay.textContent = "YOU LOSE!";
        squares.forEach((square) => {
            if (square.classList.contains("bomb")) {
                square.classList.add("checked");
                square.innerHTML = "💣";
            }
        });
    }

    // Check Win
    function checkWin() {
        const correctlyFlagged = squares.filter(
            (square) => square.classList.contains("flag") && square.classList.contains("bomb")
        ).length;

        const checkedCells = squares.filter((square) => square.classList.contains("checked")).length;

        if (correctlyFlagged === bombCount && checkedCells === width * width - bombCount) {
            resultDisplay.textContent = "YOU WIN!";
            isGameOver = true;
        }
    }

    createBoard();
});

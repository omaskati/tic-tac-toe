
const createPlayer = function(id, symbol, type){

    let name = `Player ${symbol}`;
    const getPlayerName = function(){
        return name;
    };

    const setPlayerName =function(pName){
        if(pName === "") return;
        name = pName;
    }
    const getSymbol = function(){
        return symbol;
    };

    const getID = function(){
        return id;
    }

    return {getID, getPlayerName, setPlayerName, getSymbol, type};
}

const gameboard = (function(){
    let board =[];
    let boardSize = 3;
    let empty = true;
    const reset = () => {
        board=[];
        for(let i = 0; i < boardSize; i++){
            let row = [];
            for(let j = 0; j < boardSize; j++){
                row.push(' ');
            }
            board.push(row);
        }
        empty = true;
    };

    const isEmpty = () => empty;
    const getSize = () => boardSize;
    const setSize = (size) => {
        size = Number(size);
        if(!isNaN(size)){
            if(size < 3){
                console.log("Size must be at least 3");
                return false;
            }

            else if(size > 10){
                console.log("Sorry, size can't be more than 10.");
                return false;
            }
            else{
                boardSize = Math.floor(size);
                console.log(`Size set to ${boardSize}`);
                return true;
            }
        }
        else{
            console.log("Size should be a number");
            return false;
        }
    }

    const markSquare = (row, col, symbol) => {
        if(board[row][col] !== ' '){
            console.log("That square is taken. Try again");
            return false;
        }
        board[row][col] = symbol;
        empty = false;
        return true;
    }

    function checkRow(num){
        return (board[num][0] === board[num][1]) 
                && (board[num][1] === board[num][2])
                && (board[num][1] !== ' ');
    }
    
    function checkCol(num){
        return (board[0][num] === board[1][num]) 
                && (board[1][num] === board[2][num])
                && (board[1][num] !== ' ');
    }
    
    function checkDiags(){
        return (board[1][1] !== ' ') 
                && ((board[0][0] === board[1][1]) && (board[1][1] === board[2][2]) 
                    || (board[2][0] === board[1][1]) && (board[1][1] === board[0][2])
                    );
    }

    const checkWin = () => {
        for(let i = 0; i<board.length; i++){
            if(checkRow(i)) return true;
            else if(checkCol(i)) return true;
        }
        return checkDiags();
    }

    const print = () => {
        console.table(board);
    }

    const getSquare = (row, col) => {
        return board[row][col];
    };

    reset();

    return {isEmpty, getSquare, getSize, setSize, checkWin, markSquare, print, reset};
})();

const displayController = (function(){
    const screen = document.getElementById("game-container");
    // const gameForm = document.querySelector("form");
    const gameInputs = document.querySelector("#game-inputs");
    const startBtn = document.querySelector("#start-btn");
    for(let i=0; i< gameboard.getSize(); i++){

        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        for(let j = 0; j < gameboard.getSize(); j++){

            let symbolSpan = document.createElement("span");
            symbolSpan.classList.add("symbol");
            symbolSpan.textContent = gameboard.getSquare(i, j);
            let squareDiv = document.createElement("div");
            squareDiv.classList.add("square");
            squareDiv.setAttribute("data-row", `${i}`);
            squareDiv.setAttribute("data-col", `${j}`);
            squareDiv.appendChild(symbolSpan);

            addClickHandler(squareDiv);

            rowDiv.appendChild(squareDiv);
        }
        screen.appendChild(rowDiv);
    }
    const rows = Array.from(screen.querySelectorAll(".row"));
    //new function that just rewrites to each cell
    const updateDisplay = function(){
        console.log(rows);
        for(let i=0; i< gameboard.getSize(); i++){
            let squareSymbols = Array.from(rows[i].querySelectorAll(".square>span"));
            for(let j = 0; j < gameboard.getSize(); j++){
                squareSymbols[j].textContent = gameboard.getSquare(i, j);
            }
        }
    }

    const displayResult = function(msg){
        const dialog = document.querySelector("#result-dialog");
        document.querySelector("#result-msg").textContent=msg;
        document.querySelector("#dialog-close").addEventListener("click", () => {
            dialog.close();
          });
        dialog.showModal();
    }

    startBtn.addEventListener("click", (event)=>{
        event.preventDefault();
        let inputs = gameInputs.getElementsByTagName("input");
        // let pXName = event.target.querySelector("input#playerX");
        // let pOName = event.target.querySelector("input#playerO");
        
        
        game.setPlayerNames(inputs[0].value,inputs[1].value);
        game.start();
        event.target.disabled = true;
        inputs[0].disabled = true;
        inputs[1].disabled = true;    
    });



    function clickHandler(event){
        let square = event.target;
        let row = square.getAttribute("data-row");
        let col = square.getAttribute("data-col");
        console.log(`Row: ${row}, Col: ${col}`);

        game.play(row, col);
    }

    function addClickHandler(elem){
        elem.addEventListener("click", clickHandler);
    }

    return {updateDisplay, displayResult};

})();

const game = (function(){

    let gameOn = false;
    let activePlayer = null;
    let resultMsg = "";
    let round = 0;

    const player1 = createPlayer(1, "X", "user");
    const player2 = createPlayer(2, "O", "user");

    const start = function(){
        if(gameOn){
            console.log("Game has already started!");
        }
        else{
            gameOn = true;
            if(!gameboard.isEmpty()) gameboard.reset();

            activePlayer = player1;
            round = 1;

            printActivePlayer();
            gameboard.print();
            displayController.updateDisplay();
        }
    };

    const switchPlayer = function(){
        if(activePlayer.getID() === 1){
            activePlayer = player2;
        }
        else activePlayer = player1;
    };

    const printActivePlayer = function(){
        console.log(`It's ${activePlayer.getPlayerName()}'s turn!`);
    }

    const play = function(row, col){
        if(gameOn === false){
            console.log("Start a new game by typing game.start()");
            return;
        } 
        if(gameboard.markSquare(row, col, activePlayer.getSymbol())){
            gameboard.print();
            displayController.updateDisplay();
            if(round >= gameboard.getSize()*2-1){
                if(gameboard.checkWin()){
                    gameOn = false;
                    resultMsg = `${activePlayer.getPlayerName()} wins!`;
                    console.log(resultMsg);
                    displayController.displayResult(resultMsg);
                    return;
                }
                else{
                    if(round === gameboard.getSize()*gameboard.getSize()){
                        gameOn = false;
                        resultMsg = `Game is a Draw :/`;
                        console.log(resultMsg);
                        displayController.displayResult(resultMsg);
                        return;
                    }
                }
            }
            switchPlayer();
            printActivePlayer();
            round++;
        }

        else{
            gameboard.print();
            displayController.updateDisplay();
        }
    };

    const setPlayerNames = function(p1, p2){
        player1.setPlayerName(p1);
        player2.setPlayerName(p2);
    };
    
    return {start, play, setPlayerNames};
})();

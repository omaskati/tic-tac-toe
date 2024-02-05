
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

    const setSymbol =function(pSymbol){
        if(pSymbol === "") return;
        symbol = pSymbol;
        setPlayerName(`Player ${symbol}`);
    }

    const getID = function(){
        return id;
    }

    return {getID, getPlayerName, setPlayerName, getSymbol, setSymbol, type};
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
    const gameInputs = document.querySelector("#game-inputs");
    const gameBtn = document.querySelector("#game-btn");
    const dialog = document.querySelector("#result-dialog");
    const statusMsg = document.querySelector("#status-msg");
    const symbols1 = document.querySelector("#player1-symbols");
    const symbols2 = document.querySelector("#player2-symbols");

    const player1Symbols = [{char: "X", class: ["selected"]},
                            {char: "O", class: []},
                            {char: "*", class: []},
                            {char: "=)", class: ["btn-smiley"]},
                            {char: "&hearts;", class: []}];
    const player2Symbols = [{char: "O", class: ["selected"]},
                            {char: "X", class: []},
                            {char: "*", class: []},
                            {char: "=)", class: ["btn-smiley"]},
                            {char: "&hearts;", class: []}];

    let gameBtnFn = "start";

    for(let i=0; i< gameboard.getSize(); i++){

        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        if(i === gameboard.getSize()-1) rowDiv.classList.add("last-row");

        for(let j = 0; j < gameboard.getSize(); j++){

            let symbolSpan = document.createElement("span");
            symbolSpan.classList.add("symbol");
            symbolSpan.textContent = gameboard.getSquare(i, j);
            let squareDiv = document.createElement("div");
            squareDiv.classList.add("square");
            if(i === 0) squareDiv.classList.add("first-row");
            if(j === 0) squareDiv.classList.add("first-col");
            if(i === gameboard.getSize()-1) squareDiv.classList.add("last-row");
            if(j === gameboard.getSize()-1) squareDiv.classList.add("last-col");
            squareDiv.setAttribute("data-row", `${i}`);
            squareDiv.setAttribute("data-col", `${j}`);
            squareDiv.appendChild(symbolSpan);

            addClickHandler(squareDiv);

            rowDiv.appendChild(squareDiv);
        }
        screen.appendChild(rowDiv);
    }
    //init Symbol buttons
    const initSymbols = function(symbols, parentElem){
        console.log("initting symbols");
        let index = 0;
       symbols.forEach(symbol => {
            let symBtn = document.createElement("button");
            symbol.class.forEach(classname =>{
                symBtn.classList.add(classname);
            });
            symBtn.value = symBtn.innerHTML = symbol.char;
            symBtn.setAttribute("data-index", index);
            index++;
            parentElem.appendChild(symBtn);
        });
    }
    initSymbols(player1Symbols, symbols1);
    initSymbols(player2Symbols, symbols2);

    const rows = Array.from(screen.querySelectorAll(".row"));
    //new function that just rewrites to each cell
    const updateDisplay = function(){
        console.log(rows);
        for(let i=0; i< gameboard.getSize(); i++){
            let squareSymbols = Array.from(rows[i].querySelectorAll(".square>span"));
            for(let j = 0; j < gameboard.getSize(); j++){
                squareSymbols[j].innerHTML = gameboard.getSquare(i, j);
            }
        }
    }

    const updateStatus = function(msg){
        statusMsg.innerHTML = msg;
    }

    const displayResult = function(msg){
        document.querySelector("#result-msg").innerHTML=msg;
        document.querySelector("#dialog-close").addEventListener("click", () => {
            dialog.close();
          });
        dialog.showModal();
    }

    const endDisplay = function(){
        updateStatus("Good Game!");
        gameBtn.textContent="New Game";
    }

    const resetDisplay = function(){
            updateDisplay();
            updateStatus("Let's Play!");
    }



    gameBtn.addEventListener("click", (event)=>{
        event.preventDefault();
        let inputs = gameInputs.getElementsByTagName("input");
        let p1Symbol = symbols1.getElementsByClassName("selected");
        let p2Symbol = symbols2.getElementsByClassName("selected");
        if(gameBtnFn === "start"){

            if(p2Symbol.length + p1Symbol.length < 2){
                console.log("symbols not selected");
                return;
            }

            game.setPlayerSymbols(p1Symbol[0].value, p2Symbol[0].value); //changed from innerhtml to value, does this work?
            game.setPlayerNames(inputs[0].value,inputs[1].value);
            game.start();
            
            inputs[0].disabled = true;
            inputs[1].disabled = true;
            for(let i = 0; i<5; i++){
                symbols1.getElementsByTagName("button")[i].disabled = true;
                symbols2.getElementsByTagName("button")[i].disabled = true;
            }

            event.target.textContent = "Reset Game";
            gameBtnFn = "reset";

        }
        
        else if(gameBtnFn === "reset"){

            game.reset();

            gameBtnFn = "start";
            inputs[0].disabled = false;
            inputs[1].disabled = false;
            for(let i = 0; i<5; i++){
                symbols1.getElementsByTagName("button")[i].disabled = false;
                symbols2.getElementsByTagName("button")[i].disabled = false;
            }
            event.target.textContent = "Start Game";

        }
    });

    for(let i=0; i<5; i++){
        symbols1.getElementsByTagName("button")[i].onclick = symbolSelectHandler;
        symbols2.getElementsByTagName("button")[i].onclick = symbolSelectHandler;
    }

    function symbolSelectHandler(event){

        let symBtn = event.target;
        if(symBtn.parentElement.id === "player1-symbols"){
            if(game.setPlayer1Symbol(symBtn.value)){
                let selectedBtn = symbols1.getElementsByClassName("selected");
                if(selectedBtn.length>0) selectedBtn.item(0).classList.remove("selected");
            }
        }

        else{
            if(game.setPlayer2Symbol(symBtn.value)){
                let selectedBtn = symbols2.getElementsByClassName("selected");
                if(selectedBtn.length>0) selectedBtn.item(0).classList.remove("selected");
            }
        }
        symBtn.classList.add("selected");

        //DOM SOLUTION
        // let symBtn = event.target;
        // if(symBtn.parentElement.id === "player1-symbols"){
        //     let selectedBtn = symbols1.getElementsByClassName("selected");
        //     if(selectedBtn.length>0) selectedBtn.item(0).classList.remove("selected");
        //     checkSelectedSymbols(symBtn.innerHTML, symbols2);
        // }

        // else{
        //     let selectedBtn = symbols2.getElementsByClassName("selected");
        //     if(selectedBtn.length>0) selectedBtn.item(0).classList.remove("selected");
        //     checkSelectedSymbols(symBtn.innerHTML, symbols1);
        // }
        // symBtn.classList.add("selected");
    }

    const updateSymbol = function(playerID, symbol){
        let symbols = symbols1;
        if(playerID === 2){
            symbols = symbols2;
        }else;

        for(let i = 0; i< symbols.childElementCount; i++){
            let symBtn = symbols.children.item(i);
            
            if (symBtn.value === symbol){
                console.log(`clicking the ${symbol} button for Player ${playerID}`);
                symBtn.click();
            }
        }
    };

    const checkSelectedSymbols = function(symbol, opponentSymbols){
        //make this a callback fxn for a click on a symbol button
        //if all btns with same class (e.g. btn-X) are selected, then deselect the other one?
        //have to figure out how to deselct the right one...
        //OR
        //If selected button. textContent == other btn group selected
        let oppSelected = opponentSymbols.getElementsByClassName("selected");
        if(oppSelected.length > 0){
            if(symbol === oppSelected.item(0).innerHTML){
                oppSelected.item(0).classList.remove("selected");
            }
        }
    }

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

    return {updateDisplay, updateStatus, updateSymbol, displayResult, endDisplay, resetDisplay};

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

            updateGameStatus();
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

    const updateGameStatus = function(){
        let statusMsg = `${activePlayer.getPlayerName()}'s turn`;
        displayController.updateStatus(statusMsg);
        console.log(statusMsg);
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
                    displayController.endDisplay();
                    return;
                }
                else{
                    if(round === gameboard.getSize()*gameboard.getSize()){
                        gameOn = false;
                        resultMsg = `Game is a Draw :/`;
                        console.log(resultMsg);
                        displayController.displayResult(resultMsg);
                        displayController.endDisplay();
                        return;
                    }
                }
            }
            switchPlayer();
            updateGameStatus();
            round++;
        }

        else{
            gameboard.print();
            displayController.updateDisplay();
        }
    };

    const reset = function(){
        gameOn = false;
        gameboard.reset();
        displayController.resetDisplay();
    }

    const setPlayerNames = function(p1, p2){
        player1.setPlayerName(p1);
        player2.setPlayerName(p2);
    };

    const setPlayer1Symbol = function(sym){
        console.log(`Trying to set Player1 symbol to ${sym}`);
        if(sym === ""){
            console.log("Players cannot have empty symbols");
            return false;    
        }
        else{
            let oldSym = player1.getSymbol();
            console.log(`Setting Player1 symbol to ${sym}`);
            player1.setSymbol(sym);

            if(player2.getSymbol() === sym){
                console.log(`But Player1 also has symbol ${sym}`);
                console.log("Players cannot have same symbol.");
                player2.setSymbol(oldSym);
                console.log("Switching Player 2 symbol to " + oldSym);
                console.log("Updating Player 2 display symbol");
                displayController.updateSymbol(2, oldSym);

            }
        } 
        return true;    
    }

    const setPlayer2Symbol = function(sym){
        console.log(`Trying to set Player2 symbol to ${sym}`);
        if(sym === ""){
            console.log("Players cannot have empty symbols");
            return false;    
        }
        else{
            let oldSym = player2.getSymbol();
            player2.setSymbol(sym);
            console.log(`Setting Player2 symbol to ${sym}`);

            if(player1.getSymbol() === sym){
                console.log(`But Player1 also has symbol ${sym}`);
                console.log("Players cannot have same symbol.");
                player1.setSymbol(oldSym);
                console.log("Switching Player 1 symbol to " + oldSym);
                console.log("Updating Player 1 display symbol");
                displayController.updateSymbol(1, oldSym);
            }
        } 
        return true;    
    }

    const setPlayerSymbols = function(s1,s2){
        setPlayer1Symbol(s1);
        setPlayer2Symbol(s2);
    }
    
    return {start, play, reset, setPlayerNames, setPlayer1Symbol, setPlayer2Symbol, setPlayerSymbols};
})();

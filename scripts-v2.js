
const createPlayer = function(id, symbol, type){

    const getPlayerName = function(){
        return `Player${id}`;
    };
    const getSymbol = function(){
        return symbol;
    };

    return {id, getPlayerName, getSymbol, type};
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
                row.push('');
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
        if(board[row][col] !== ''){
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
                && (board[num][1] !== '');
    }
    
    function checkCol(num){
        return (board[0][num] === board[1][num]) 
                && (board[1][num] === board[2][num])
                && (board[1][num] !== '');
    }
    
    function checkDiags(){
        return (board[1][1] !== '') 
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

    reset();

    return {isEmpty, getSize, setSize, checkWin, markSquare, print, reset};
})();

const game = (function(){

    let gameOn = false;
    let activePlayer = null;
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
        }
    };

    const switchPlayer = function(){
        if(activePlayer.id === 1){
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
            if(round >= gameboard.getSize()*2-1){
                if(gameboard.checkWin()){
                    gameOn = false;
                    console.log(`${activePlayer.getPlayerName()} wins!`);
                    return;
                }
                else{
                    if(round === gameboard.getSize()*gameboard.getSize()){
                        gameOn = false;
                        console.log(`Game is a Draw :/`);
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
        }
    };
    

    return {start, play};
})();

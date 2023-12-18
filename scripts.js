console.log("We're live");

//Game status: active = true, over = false;
let gameOn = true;

let board = [];
let round = 1;
let activePlayer = null;
let size = 3;


function initBoard(size){
    for(let i = 0; i < size; i++){
        let row = [];
        for(let j = 0; j < size; j++){
            row.push('');
        }
        board.push(row);
    }
}

function displayBoard(){
    console.table(board);
}

const createPlayer = function(id, symbol, type){

    this.getPlayerName = function(){
        return `Player${id}`;
    }
    this.getSymbol = function(){
        return symbol;
    }
    return {id, name: this.getPlayerName(), symbol: this.getSymbol(), type};
}

function playRound(){
    //get active player
    //do (receive input from user (square selected))
    let row,col;
    
    do{
        //if(activePlayer.type === "user"){
        //}
        //else{
            row = Math.floor(3*Math.random());
            col = Math.floor(3*Math.random());
        //}
    }
    while(selectSquare(row,col) == false);
    //while (!inputIsValid) aka square is Empty
    //place activePlayer.symbol in square
    //if(threeInARow())
        //winner is active player
        //loser is inactive player
        //end game
    //else if gameBoardFull()
        //draw
        //end game
    //else switchPlayer
}

function play(){
    //create Player1 and Player2
    const player1 = createPlayer(1, "X", "comp");
    const player2 = createPlayer(2, "O", "comp");
    activePlayer = player1;
    let numRounds = board.length*board.length;
    for(let i = 0; i < numRounds; i++){
        playRound();
        displayBoard();
        if(i >= board.length*2-1){
            if(checkWin()){
                console.log(`${activePlayer.name} wins!`);
                return;
            }
        }
        if(activePlayer.id === 1)
            activePlayer = player2;
        else activePlayer = player1;
    }

    console.log(`Game is a Draw :/`);
    //switchActivePlayer;
    //while(gameOn){
        //playRound();
    //}
}

function selectSquare(row, col){
    if(board[row][col] !== ''){
        if(activePlayer.type === "user"){
            console.log("That square is taken. Try again");
        }
        return false;
    }
    board[row][col] = activePlayer.symbol;
    return true;
}

function getPlayerInput(event){
    //do
    //let square = selected square by user
   // while squareIsEmpty

    //return square;

    let square = event.target;
    square.getAttribute("data-row");

}

function checkWin(){
    for(let i = 0; i<board.length; i++){
        if(checkRow(i)) return true;
        else if(checkCol(i)) return true;
    }
    return checkDiags();
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

// initBoard(3);
// displayBoard();
// play();



//begin check win only after round 5

//possible wins:
    //all same col#
    //all same row#
    //all different row# and all different col#

//idea for later: hint button (check if win is possible for opponent or player, suggest move to block or win)
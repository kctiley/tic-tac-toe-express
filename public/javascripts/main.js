var board = [ {position: "topLeft"},
          {position: "topCenter"},
          {position: "topRight"},
          {position: "middleRight"},
          {position: "bottomRight"},
          {position: "bottomCenter"},
          {position: "bottomLeft"},
          {position: "middleCenter"},
          {position: "center"}
];

var rotateBoard = function(){
  var newFirst = board.slice(6,8);
  var newLast = board.slice(0,6);
  var center = board[8];
  var newArr = newFirst;
  newLast.forEach(function(each){
    newArr.push(each);
  })
  newArr.push(center);
  board = newArr;
}

var rotateBoardToOriginalPosition = function(){
  while(board[0].position !== "topLeft"){
    rotateBoard();
  }
}

var showBoard = function(){

  for(var i = 0; i < board.length; i++){
    if(board[i].marker !== "[ ]"){
      var element = document.getElementById("" + i + "");
      element.innerHTML = board[i].marker;
    }
    else {
      // For updating the board in case of game restart
      var element = document.getElementById("" + i + "");
      element.innerHTML = "";
    }
  }
}

var updateBoard = function(lastPlayer){
  moveCount++;
  rotateBoardToOriginalPosition();
  showBoard();
  availPositions = [];
  board.forEach(function(boardSlot){
    if(boardSlot.marker == "[ ]"){
      availPositions.push(boardSlot.position);
    }
  })
  if(winner){
    document.getElementById('win-message').style.display = "block";
    document.getElementById('board-container').style.opacity = .15;
    gameActive = false;
  }
  else if (availPositions.length == 0){
    document.getElementById('tie-message').style.display = "block";
    document.getElementById('board-container').style.opacity = .15;
    gameActive = false;
  }
  else {
    (moveCount == 0 || lastPlayer == "User")? computerMove() : console.log("Waiting for user to move..........");
  }
}

var computerMove = function() { 
  var availWinsUser = [];
  var availWinsComputer = [];
  var checkForBlockOrWin = function(){
    var mrkrs = [" X ", " O "];
    for (var i = 0; i < 2; i++){
      var mrkr = mrkrs[i];
      if(availWinsComputer.length == 0){
        // Perimeter win scenarios
        // topCenter avail top row
        if(board[0].marker == mrkr && board[1].marker == "[ ]" && board[2].marker == mrkr){
          mrkr == " X "? availWinsComputer.push(board[1]) : availWinsUser.push(board[1]);
        }
        // topLeft avail top row
        if(board[0].marker == "[ ]" && board[1].marker == mrkr && board[2].marker == mrkr){
          mrkr == " X "? availWinsComputer.push(board[0]) : availWinsUser.push(board[0]);
        }
        // topRight avail top row
        if(board[0].marker == mrkr && board[1].marker == mrkr && board[2].marker == "[ ]"){
          mrkr == " X "? availWinsComputer.push(board[2]) : availWinsUser.push(board[2]);
        }
        // Center row win scenarios
        // middle avail center row
        if(board[7].marker == mrkr && board[8].marker == "[ ]" && board[3].marker == mrkr){
          mrkr == " X "? availWinsComputer.push(board[8]) : availWinsUser.push(board[8]);
        }
        // middleLeft avail center row
        if(board[7].marker == "[ ]" && board[8].marker == mrkr && board[3].marker == mrkr){
          mrkr == " X "? availWinsComputer.push(board[7]) : availWinsUser.push(board[7]);
        }
        // middleRight avail center row
        if(board[7].marker == mrkr && board[8].marker == mrkr && board[3].marker == "[ ]"){
          mrkr == " X "? availWinsComputer.push(board[3]) : availWinsUser.push(board[3]);
        }
        // Diagonal scenarios
        // center avail
        if(board[0].marker == mrkr && board[8].marker == "[ ]" && board[4].marker == mrkr){
          mrkr == " X "? availWinsComputer.push(board[8]) : availWinsUser.push(board[8]);
        }
        // topRight avail
        if(board[0].marker == "[ ]" && board[8].marker == mrkr && board[4].marker == mrkr){
          mrkr == " X "? availWinsComputer.push(board[0]) : availWinsUser.push(board[0]);
        }
        // bottomRight avail
        if(board[0].marker == mrkr && board[8].marker == mrkr && board[4].marker == "[ ]"){
          mrkr == " X "? availWinsComputer.push(board[4]) : availWinsUser.push(board[4]);
        }
      }
    }
  }// End checkForBlockOrWin function

  // Begin Computer check for scenarios
  // console.log("Computer move...");
  if (moveCount == 0){
    // Select 
    var cornerIndexArray = [0, 2, 4, 6]
    var indexRandom = cornerIndexArray[Math.floor(Math.random() * 4)];
    var boardSlot = board[indexRandom];
    boardSlot.marker = " X ";
  }
  else if (moveCount == 2){
    // console.log("In computer 3rd move");
    // Rotate board 3 times to check for match and rotate 1 more time to reset to original position
    for (var i = 0; i < 5; i++){
      if(i > 0){rotateBoard();}
      if(board[0].marker == " X "){
        // Scenario 2nd move was center
        if(board[8].marker == " O "){board[4].marker = " X ";
          break;
        }
        // Scenario 2nd move was near side
        if(board[1].marker == " O "){board[6].marker = " X ";
          break;
        }
        if(board[7].marker == " O "){board[4].marker = " X ";
          break;
        }
        // Scenario 2nd move was near corner
        if(board[2].marker == " O " || board[6].marker == " O "){board[4].marker = " X ";
          break;
        }
        // Scenario 2nd move was far side
        if(board[3].marker == " O "){board[6].marker = " X ";
          break;
        }
        if(board[5].marker == " O "){board[2].marker = " X ";
          break;
        }
        // Scenario 2nd move was a far corner. This scenario could be included with 2nd move far side scenario IF NOT doing random ux
        if(board[0].marker == " X " && board[4].marker == " O "){
          //board[2].marker = " X ";
          // or go to board[6].marker = " X " for random ux
          var cornerIndexArray = [2, 6];
          var randomIndex = cornerIndexArray[Math.floor(Math.random() * 2)]
          var boardSlot = board[randomIndex];
          boardSlot.marker = " X ";
          break;
        }
      }
    }
  }
  else if (moveCount == 4){
    // console.log("In computer 5th move");
    // Rotate board 3 times to check for match and rotate 1 more time to reset to original position
    for (var i = 0; i < 5; i++){
      if(i > 0){rotateBoard();}
      checkForBlockOrWin();
    }  
    // Block or Win also covers scenario move 2 was near corner since next move will either be win or block
    // Go for win
    if(availWinsComputer.length > 0){
      availWinsComputer[0].marker = " X ";
      winner = "Computer wins!";
    }
    // Go for block
    // Block also covers scenario move 2 was center and any 4th move would be block
    else if(availWinsUser.length > 0){
      availWinsUser[0].marker = " X ";
    }
    else {
      for (var i = 0; i < 5; i++){
        if(i > 0){rotateBoard();}
        if(board[0].marker == " X "){
          // Scenario moves 2 and 4 were side moves
          if(board[1].marker == " O " && board[7].marker == " O "){board[4].marker = " X ";
            break;
          }
          // Scenario move 2 far side and move 4 center
          if(board[3].marker == " O " && board[8].marker == " O "){board[6].marker = " X ";
            break;
          }
          if(board[5].marker == " O " && board[8].marker == " O "){board[2].marker = " X ";
            break;
          }
          // Scenario 2nd move was far corner
          if(board[1].marker == " O " && board[4].marker == " O " && board[2].marker == " X "){board[6].marker = " X ";
            break;
          }
          if(board[1].marker == " O " && board[6].marker == " O " && board[2].marker == " X "){board[4].marker = " X ";
            break;
          }
        }
      }
    }
  }
  else if (moveCount > 4){
    // console.log("In computer move 7 or more")
    // Rotate board 3 times to check for match and rotate 1 more time to reset to original position
    for (var i = 0; i < 5; i++){
      if(i > 0){rotateBoard();}
      checkForBlockOrWin();
    }  
    // Go for win
    if(availWinsComputer.length > 0){
      availWinsComputer[0].marker = " X ";
      winner = "Computer wins";
    }
    // Go for block if win not avail
    else if(availWinsUser.length > 0){  
      availWinsUser[0].marker = " X ";
    }
    else {
      // console.log("In moveCount > 4 ...scenario not coded")
    }
  }
  else {
    console.log("Scenario not coded yet")
  }
  // resetBoard();
  updateBoard("Computer");

}

var userMove = function(boardSlotId){
  if (gameActive){
    // console.log("User move...");
    // var position = prompt("Select from available positions: " + availPositions.join(', '));
    var position = board[boardSlotId].position;
    var moveValid = false;
    for (var i = 0; i < board.length; i++){
      if(position == board[i].position && board[i].marker == "[ ]"){
        board[i].marker = " O ";
        moveValid = true;
        // console.log("User move: " + board[i].position);
        updateBoard("User");
      }
    }
    if(moveValid == false){
      var continueGame = prompt("Invalid move. Continue y or n?");
      if(continueGame == "y"){
        // console.log("User must make a move");
      }
    }
  }
}

// Initial values and game start
var winner;
var moveCount;
var availPositions;
var gameActive;

var startGame = function(){
  winner = false;
  moveCount = -1;
  gameActive = true;
  board.forEach(function(boardSlot){
    boardSlot.marker = "[ ]";
  })
  var element = document.getElementById('start-button');
  element.innerHTML = "restart";
  document.getElementById('win-message').style.display = "none";
  document.getElementById('tie-message').style.display = "none";
  document.getElementById('board-container').style.opacity = 1;
  updateBoard()
}

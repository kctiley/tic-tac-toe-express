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

var x = " X ";
var o = " O ";
var blank = "[ ]";

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
    if(board[i].marker !== blank){
      var element = document.getElementById("" + i + "");
      element.innerHTML = board[i].marker;
    }
  }
}

var updateBoard = function(lastPlayer){
  moveCount++;
  rotateBoardToOriginalPosition();
  showBoard();
  availPositions = [];
  var gameOverDisplay = function(messageId){
    document.getElementById(messageId).style.display = "block";
    document.getElementById('board-container').style.opacity = .15;
    gameActive = false;
  }
  board.forEach(function(boardSlot){
    if(boardSlot.marker == blank){
      availPositions.push(boardSlot.position);
    }
  })
  if(winner){
    gameOverDisplay('win-message');
  }
  else if (availPositions.length == 0){
    gameOverDisplay('tie-message');
  }
  else {
    (moveCount == 0 || lastPlayer == "User")? computerMove() : console.log("Waiting for user to move..........");
  }
}

var computerMove = function() { 
  var availWinsUser = [];
  var availWinsComputer = [];
  var checkForBlockOrWin = function(){
    var mrkrs = [x, o];
    for (var i = 0; i < 2; i++){
      var mrkr = mrkrs[i];
      var checkForTwoSameAndOneEmpty = function(indexMarked1, indexMarked2, indexBlank ){
        var slots = [indexMarked1, indexMarked2, indexBlank];
        for (var j = 0; j < 3; j++){
          if(board[slots[0]].marker == mrkr && board[slots[1]].marker == mrkr && board[slots[2]].marker == blank){
            mrkr == x? availWinsComputer.push(board[slots[2]]) : availWinsUser.push(board[slots[2]]); 
          }
          slots.unshift(slots[2]);
          var rotatedSlotsArray = slots.slice(0,3);
          slots = rotatedSlotsArray;
        }
      }
      if(availWinsComputer.length == 0){
        // Perimeter win scenarios
        checkForTwoSameAndOneEmpty(0,2,1);

        // Center row win scenarios
        checkForTwoSameAndOneEmpty(7,3,8);

        // Diagonal scenarios
        checkForTwoSameAndOneEmpty(0,4,8);
      }
    }
  }// End checkForBlockOrWin function

  // Begin Computer check for scenarios
  if (moveCount == 0){
    // Select 
    var cornerIndexArray = [0, 2, 4, 6]
    var indexRandom = cornerIndexArray[Math.floor(Math.random() * 4)];
    var boardSlot = board[indexRandom];
    boardSlot.marker = x;
  }
  else if (moveCount == 2){
    // Rotate board 3 times to check for match and rotate 1 more time to reset to original position
    for (var i = 0; i < 4; i++){
      if(i > 0){rotateBoard();}
      if(board[0].marker == x){
        // Scenario 2nd move was center
        if(board[8].marker == o){board[4].marker = x;
          break;
        }
        // Scenario 2nd move was near side
        if(board[1].marker == o){board[6].marker = x;
          break;
        }
        if(board[7].marker == o){board[4].marker = x;
          break;
        }
        // Scenario 2nd move was near corner
        if(board[2].marker == o || board[6].marker == o){board[4].marker = x;
          break;
        }
        // Scenario 2nd move was far side
        if(board[3].marker == o){board[6].marker = x;
          break;
        }
        if(board[5].marker == o){board[2].marker = x;
          break;
        }
        // Scenario 2nd move was a far corner. This scenario could be included with 2nd move far side scenario IF NOT doing random ux
        if(board[0].marker == x && board[4].marker == o){
          //board[2].marker = x;
          // or go to board[6].marker = x for random ux
          var cornerIndexArray = [2, 6];
          var randomIndex = cornerIndexArray[Math.floor(Math.random() * 2)]
          var boardSlot = board[randomIndex];
          boardSlot.marker = x;
          break;
        }
      }
    }
  }
  else if (moveCount == 4){
    // Rotate board 3 times to check for match and rotate 1 more time to reset to original position
    for (var i = 0; i < 5; i++){
      if(i > 0){rotateBoard();}
      checkForBlockOrWin();
    }  
    // Block or Win also covers scenario move 2 was near corner since next move will either be win or block
    // Go for win
    if(availWinsComputer.length > 0){
      availWinsComputer[0].marker = x;
      console.log("winner computer detected")
      winner = "Computer wins!";
    }
    // Go for block
    // Block also covers scenario move 2 was center and any 4th move would be block
    else if(availWinsUser.length > 0){
      availWinsUser[0].marker = x;
    }
    else {
      for (var i = 0; i < 5; i++){
        if(i > 0){rotateBoard();}
        if(board[0].marker == x){
          // Scenario moves 2 and 4 were side moves
          if(board[1].marker == o && board[7].marker == o){board[4].marker = x;
            break;
          }
          // Scenario move 2 far side and move 4 center
          if(board[3].marker == o && board[8].marker == o){board[6].marker = x;
            break;
          }
          if(board[5].marker == o && board[8].marker == o){board[2].marker = x;
            break;
          }
          // Scenario 2nd move was far corner
          if(board[1].marker == o && board[4].marker == o && board[2].marker == x){board[6].marker = x;
            break;
          }
          if(board[1].marker == o && board[6].marker == o && board[2].marker == x){board[4].marker = x;
            break;
          }
        }
      }
    }
  }
  else if (moveCount > 4){
    // Rotate board 3 times to check for match and rotate 1 more time to reset to original position
    for (var i = 0; i < 5; i++){
      if(i > 0){rotateBoard();}
      checkForBlockOrWin();
    }  
    // Go for win
    if(availWinsComputer.length > 0){
      availWinsComputer[0].marker = x;
      winner = "Computer wins";
    }
    // Go for block if win not avail
    else if(availWinsUser.length > 0){  
      availWinsUser[0].marker = x;
    }
    else {
      // console.log("In moveCount > 4 ...scenario not coded")
    }
  }
  else {
    console.log("Scenario not coded yet")
  }
  updateBoard("Computer");

}

var userMove = function(boardSlotId){
  if (gameActive){
    var position = board[boardSlotId].position;
    var moveValid = false;
    for (var i = 0; i < board.length; i++){
      if(position == board[i].position && board[i].marker == blank){
        board[i].marker = o;
        moveValid = true;
        updateBoard("User");
      }
    }
    if(moveValid == false){
      var continueGame = prompt("Invalid move. Continue y or n?");
      if(continueGame == "y"){
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
  for(var i = 0; i < board.length; i++){
    board[i].marker = blank;
    var boardSlot = document.getElementById("" + i + "");
    boardSlot.innerHTML = "";
  }
  var startButton = document.getElementById('start-button');
  startButton.innerHTML = "restart";
  document.getElementById('win-message').style.display = "none";
  document.getElementById('tie-message').style.display = "none";
  document.getElementById('board-container').style.opacity = 1;
  updateBoard()
}

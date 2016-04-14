var board = [ {position: "topLeft"},
          {position: "topCenter"},
          {position: "topRight"},
          {position: "middleRight"},
          {position: "bottomRight"},
          {position: "bottomCenter"},
          {position: "bottomLeft"},
          {position: "middleLeft"},
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

var updateGame = function(lastPlayer){
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
      availPositions.push(boardSlot);
    }
  })
  if(winner){
    gameOverDisplay('win-message');
    startButton.innerHTML = "play again";
    startButton.style.opacity = 1;
  }
  else if (availPositions.length == 0){
    gameOverDisplay('tie-message');
    startButton.innerHTML = "play again";
    startButton.style.opacity = 1;
  }
  else {
    // (moveCount == 0 || lastPlayer == "User")? computerMove() : console.log("Waiting for user to move..........");
    (moveCount == 0 || lastPlayer == "Computer")? console.log("Waiting for user to move..........") : computerMove();
  }
}

var computerMove = function() { 
  var availWinsUser = [];
  var availWinsComputer = [];
  var notBlockedlockedMoveOptions = [];

  var selectRandomIndex = function(array){
    console.log('..selecting random index');
    var randomIndex = array[Math.floor(Math.random() * array.length)];
    board[randomIndex].marker = x;
  }
  var checkForBlockOrWin = function(){
    var mrkrs = [x, o];
    for (var i = 0; i < 2; i++){
      var mrkr = mrkrs[i];
      var checkForTwoSameAndOneEmpty = function(indexMarked1, indexMarked2, indexBlank ){
        var indexes = [indexMarked1, indexMarked2, indexBlank];
        for (var j = 0; j < 3; j++){
          if(board[indexes[0]].marker == mrkr && board[indexes[1]].marker == mrkr && board[indexes[2]].marker == blank){
            mrkr == x? availWinsComputer.push(board[indexes[2]]) : availWinsUser.push(board[indexes[2]]); 
          }
          indexes.unshift(indexes[2]);
          var rotatedindexesArray = indexes.slice(0,3);
          indexes = rotatedindexesArray;
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
  }

  var chooseRandomAvailablePosition = function(){
    var availBoardIndexes = [];
    for (var i = 0; i < board.length; i++) {
      availPositions.forEach(function(avail){
        if(avail.position == board[i].position){
          availBoardIndexes.push(i);
        }
      })
    }
    console.log(availBoardIndexes)
    selectRandomIndex(availBoardIndexes);
  }

  var rankOptionsMove = function(){
    console.log("rankOptionsMove...")
    var mrkr = x;
    var checkForNonBlockedMoves = function(index1, index2, index3){
      var indexes = [index1, index2, index3];
      for (var j = 0; j < 3; j++){
        if(board[indexes[0]].marker == blank && board[indexes[1]].marker == blank && board[indexes[2]].marker == blank){
          notBlockedlockedMoveOptions.push(board[indexes[0]]); 
          notBlockedlockedMoveOptions.push(board[indexes[1]]); 
          console.log("pushing positions with one x in linear",board[indexes[0]],board[indexes[1]]) 
        }
        if(board[indexes[0]].marker == blank && board[indexes[1]].marker == blank && board[indexes[2]].marker == blank){
          notBlockedlockedMoveOptions.push(board[indexes[0]]);
          notBlockedlockedMoveOptions.push(board[indexes[1]]);
          notBlockedlockedMoveOptions.push(board[indexes[2]]);
        }
        if(board[indexes[0]].marker == blank){notBlockedlockedMoveOptions.push(board[indexes[0]]);} 
        if(board[indexes[1]].marker == blank){notBlockedlockedMoveOptions.push(board[indexes[1]]);} 
        if(board[indexes[2]].marker == blank){notBlockedlockedMoveOptions.push(board[indexes[2]]);} 

        indexes.unshift(indexes[2]);
        var rotatedindexesArray = indexes.slice(0,3);
        indexes = rotatedindexesArray;
      }
    }
    if(availWinsComputer.length == 0){
      // Perimeter scenarios
      checkForNonBlockedMoves(0,1,2);

      // Center row scenarios
      checkForNonBlockedMoves(7,8,3);

      // Diagonal scenarios
      checkForNonBlockedMoves(0,4,8);
    }
  }// End rankOptionsMove function

  // Begin Computer check for scenarios
  if (moveCount == 0){
    var cornerIndexArray = [0, 2, 4, 6]
    var indexRandom = cornerIndexArray[Math.floor(Math.random() * 4)];
    var boardSlot = board[indexRandom];
    boardSlot.marker = x;
  }
  else if (moveCount == 1){
    // Rotate board 3 times to check for match
    for (var i = 0; i < 4; i++){
      if(i > 0){rotateBoard();}
      if(board[0].marker == o){board[8].marker = x;
        break;
      }
      if(board[1].marker == o){
        selectRandomIndex([0,2])
        break;
      }
      if(board[8].marker == o){
        selectRandomIndex([0,2,4,6])
        break;
      }
    }
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
  else if (moveCount == 3){
    // Rotate board 3 times to check for match
    for (var i = 0; i < 4; i++){
      if(i > 0){rotateBoard();}
      checkForBlockOrWin();
      if(availWinsUser.length > 0){
        availWinsUser[0].marker = x;
      }
      else {
        // o is corner and
        if(board[0].marker == o && board[8].marker == x){
          if(board[3].marker == o || board[5].marker == o){
            selectRandomIndex([2,4,6])
          }
          if(board[4].marker == o){
            selectRandomIndex([1,2,3,5,6,7]) 
          }
        }
        if((board[0].marker == o && board[2].marker == x) || (board[2].marker == o && board[0].marker == x)){
          if(board[1].marker == o){board[8].marker = x}
        }
        if(board[8].marker == o && board[2].marker == x){
          if(board[6].marker == o){selectRandomIndex([0,4])}
        }
      }
    }
  }
  else if (moveCount == 4){
    // Rotate board 3 times to check for match and rotate 1 more time to reset to original position
    for (var i = 0; i < 4; i++){
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
      for (var i = 0; i < 4; i++){
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
  else if (moveCount > 4 && moveCount % 2 == 0){
    // Rotate board 3 times to check for match and rotate 1 more time to reset to original position
    for (var i = 0; i < 4; i++){
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
  else if(moveCount == 5 || moveCount == 7 || moveCount == 9){
    for (var i = 0; i < 4; i++){
      if(i > 0){rotateBoard();}
      checkForBlockOrWin();
    }
    if(availWinsComputer.length > 0){
        availWinsComputer[0].marker = x;
        winner = "Computer wins";
      }
    else if(availWinsUser.length > 0){
      availWinsUser[0].marker = x;
    }
    else {
      chooseRandomAvailablePosition();
      
    }
  }
  else {
    console.log("Scenario not coded yet")
  }
  updateGame("Computer");

}

var userMove = function(boardSlotId){
  if (gameActive){
    var position = board[boardSlotId].position;
    var moveValid = false;
    for (var i = 0; i < board.length; i++){
      if(position == board[i].position && board[i].marker == blank){
        board[i].marker = o;
        moveValid = true;
        updateGame("User");
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
var startButton = document.getElementById('start-button');

var startGame = function(){

  winner = false;
  moveCount = -1;
  gameActive = true;
  for(var i = 0; i < board.length; i++){
    board[i].marker = blank;
    var boardSlot = document.getElementById("" + i + "");
    boardSlot.innerHTML = "";
  }
  startButton.innerHTML = "restart";
  startButton.style.opacity = .5;
  document.getElementById('win-message').style.display = "none";
  document.getElementById('tie-message').style.display = "none";
  document.getElementById('board-container').style.opacity = 1;
  updateGame()
}

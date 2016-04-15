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

var rotateBaordView90Deg = function(){
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

var rotateBaordViewToOriginalPosition = function(){
  while(board[0].position !== "topLeft"){
    rotateBaordView90Deg();
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
  var gameOverDisplay = function(messageId){
    document.getElementById(messageId).style.display = "block";
    document.getElementById('board-container').style.opacity = .15;
    gameActive = false;
  }
  moveCount++;
  showBoard();
  availPositions = [];
  var isBlank = function(slot){
    return slot.marker == blank;
  }
  availPositions = board.filter(isBlank);
  
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
    // (moveCount == 0 || lastPlayer == "User")? computerMove() : console.log("Waiting for user to move...");
    (moveCount == 0 || lastPlayer == "Computer")? console.log("Waiting for user to move...") : computerMove();
  }
}

var computerMove = function() { 
  var availWinsUser = [];
  var availWinsComputer = [];
  var slotsInRowNotBlocked = [];

  var selectRandomIndex = function(array){
    console.log("selectRandomIndex..")
    var randomIndex = array[Math.floor(Math.random() * array.length)];
    board[randomIndex].marker = x;
  }
  
  var checkForTwoSameAndOneBlankInRow = function(markerOfPlayer){
    var mrkr = markerOfPlayer
    var check = function(indexMarked1, indexMarked2, indexBlank){
      var indexes = [indexMarked1, indexMarked2, indexBlank];
      var rotateIndexes = function(){
        indexes.unshift(indexes[2]);
        var rotatedindexesArray = indexes.slice(0,3);
        indexes = rotatedindexesArray;
      }
      for (var i = 0; i < indexes.length; i++){
        if(board[indexes[0]].marker == mrkr && board[indexes[1]].marker == mrkr && board[indexes[2]].marker == blank){
          mrkr == x ? availWinsComputer.push(board[indexes[2]]) : availWinsUser.push(board[indexes[2]]);
        }
        rotateIndexes();
      }
    }
    if(availWinsComputer.length == 0){
      check(0,2,1);
      check(7,3,8);
      check(0,4,8);
    }
  }

  var checkForBlankSlotInRowNotBlocked = function(){
    console.log("checkForBlankSlotInRowNotBlocked..")
    var mrkr = x
    var check = function(index1, index2, indexBlank){
      var indexes = [index1, index2, indexBlank];
      var rotateIndexes = function(){
        indexes.unshift(indexes[2]);
        var rotatedindexesArray = indexes.slice(0,3);
        indexes = rotatedindexesArray;
      }
      for (var i = 0; i < indexes.length; i++){
        if((board[indexes[0]].marker == mrkr || board[indexes[0]].marker == blank) && (board[indexes[1]].marker == mrkr || board[indexes[1]].marker == blank)&& board[indexes[2]].marker == blank){
          slotsInRowNotBlocked.push(board[indexes[2]]);
        }
        rotateIndexes();
      }
    }
    if(availWinsComputer.length == 0){
      check(0,2,1);
      check(7,3,8);
      check(0,4,8);
    }
    console.log(slotsInRowNotBlocked);    
  }
    
  var checkForWinMove = function(){
    checkForTwoSameAndOneBlankInRow(x);
  }
  var checkForBlockMove = function(){
    checkForTwoSameAndOneBlankInRow(o);
  }

  var chooseAnyAvailablePosition = function(){
    var availBoardIndexes = [];
    for (var i = 0; i < board.length; i++) {
      availPositions.forEach(function(avail){
        if(avail.position == board[i].position){
          availBoardIndexes.push(i);
        }
      })
    }
    selectRandomIndex(availBoardIndexes);
  }

  // Begin Computer check for scenarios
  for (var i = 0; i < 4; i++){
    var lastCheck = i == 3;
    if(lastCheck){console.log("lastCheck!")}
    checkForWinMove();
    checkForBlockMove();
    if(availWinsComputer.length > 0){
      availWinsComputer[0].marker = x;
      winner = "Computer wins!";
    }
    else if(availWinsUser.length > 0 && lastCheck){
      availWinsUser[0].marker = x;
    }
    else{
      if (moveCount == 0){
        selectRandomIndex([0,2,4,6]);
      }
      else if (moveCount == 1){
        if(board[0].marker == o){board[8].marker = x;
          break;
        }
        if(board[1].marker == o){selectRandomIndex([0,2])
          break;
        }
        if(board[8].marker == o){selectRandomIndex([0,2,4,6])
          break;
        }
      }
      else if (moveCount == 2){
        if(board[0].marker == x){
          if(board[8].marker == o){board[4].marker = x;
            break;
          }
          if(board[1].marker == o){board[6].marker = x;
            break;
          }
          if(board[7].marker == o){board[4].marker = x;
            break;
          }
          if(board[2].marker == o || board[6].marker == o){board[4].marker = x;
            break;
          }
          if(board[3].marker == o){board[6].marker = x;
            break;
          }
          if(board[5].marker == o){board[2].marker = x;
            break;
          }
          if(board[0].marker == x && board[4].marker == o){
            selectRandomIndex([2,6]);
            break;
          }
        }
      }
      else if (moveCount == 3){
        if(board[0].marker == o && board[8].marker == x){
          if(board[3].marker == o || board[5].marker == o){
            selectRandomIndex([2,4,6]);
            break;
          }
          if(board[4].marker == o){
            selectRandomIndex([1,3,5,7])
            break; 
          }
        }
        if((board[0].marker == o && board[2].marker == x) || (board[2].marker == o && board[0].marker == x)){
          if(board[1].marker == o){board[8].marker = x;
            break;
          }
        }
        if(board[8].marker == o && board[2].marker == x){
          if(board[6].marker == o){
            selectRandomIndex([0,4]);
            break;
          }
        }
      }
      else if (moveCount == 4){
        if(board[0].marker == x){
          if(board[1].marker == o && board[7].marker == o){board[4].marker = x;
            break;
          }
          if(board[3].marker == o && board[8].marker == o){board[6].marker = x;
            break;
          }
          if(board[5].marker == o && board[8].marker == o){board[2].marker = x;
            break;
          }
          if(board[1].marker == o && board[4].marker == o && board[2].marker == x){board[6].marker = x;
            break;
          }
          if(board[1].marker == o && board[6].marker == o && board[2].marker == x){board[4].marker = x;
            break;
          }
        }
      }
      else if(moveCount > 4 && lastCheck){
        checkForBlankSlotInRowNotBlocked()
        if (slotsInRowNotBlocked.length > 0){
          selectRandomIndex(slotsInRowNotBlocked)
        }
        else{
          selectRandomIndex(availPositions);
        }
      }
      else{
        console.log("No matchingscenarios iteration" + i)
      }
    }
    rotateBaordView90Deg();
  }
  rotateBaordViewToOriginalPosition();
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
  startButton.style.opacity = 0;
  document.getElementById('win-message').style.display = "none";
  document.getElementById('tie-message').style.display = "none";
  document.getElementById('board-container').style.opacity = 1;
  updateGame()
}

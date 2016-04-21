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

var loadSlotNeighbors = function(slotIndex,left, up, right, down){
  var slot = board[slotIndex];
  slot.neighbors = {};
  slot.neighbors.left = board[left];
  slot.neighbors.up = board[up];
  slot.neighbors.right = board[right];
  slot.neighbors.down = board[down];
}

loadSlotNeighbors(0, null, null, 1, 7)
loadSlotNeighbors(1, 0, null, 2, 8)
loadSlotNeighbors(2, 1, null, null, 3)
loadSlotNeighbors(3, 8, 2, null, 4)
loadSlotNeighbors(4, 5, 3, null, null)
loadSlotNeighbors(5, 6, 8, 4, null)
loadSlotNeighbors(6, null, 7, 5, null)
loadSlotNeighbors(7, null, 0, 8, 6)
loadSlotNeighbors(8, 7, 1, 3, 5)

var x = " X ";
var o = " O ";
var blank = "[ ]";

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
  var availCorners = [];
  var availSides = [];
  var isBlank = function(slot){
    return slot.marker == blank;
  }
  var isCorner = function(slot){
    return slot == board[0] || slot == board[2] || slot == board[4] || slot == board[6];
  }
  var isSide = function(slot){
    return slot == board[1] || slot == board[3] || slot == board[5] || slot == board[7];
  }
  availPositions = board.filter(isBlank);
  availCorners = availPositions.filter(isCorner);
  availSides = availPositions.filter(isSide);
  
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
  
  var forkMovesUser = [];
  var forkMovesComputer = [];

  var winMovesComputer = [];
  var winMovesUser = [];

  var selectRandom = function(slots){
    var randomIndex = Math.floor(Math.random() * slots.length);
    slots[randomIndex].marker = x;
  }

  var checkMoveOptions = function(playerMarker){

    var mkr = playerMarker;
    for(var i = 0; i < board.length; i++){
      var objCount = {};
      objCount.left = 0;
      objCount.up = 0;
      objCount.right = 0;
      objCount.down = 0;

      objCount.leftUp = 0;
      objCount.rightUp = 0;
      objCount.rightDown = 0;
      objCount.leftDown = 0;

      if(board[i].marker == blank){
        //check for neighbors
        // var checkNeighbors = function(slot, direction){
        //   var slot = slot;
        //   var direction = direction;
        //   if(slot.neighbors[direction]){
        //     if(slot.neighbors[direction].marker == mkr){
        //       objCount[direction]++;
        //       checkNeighbors(slot.neighbors[direction]);
        //     }
        //   }

        // }

        var checkLeft = function(slot){
          if(slot.neighbors.left){
            if(slot.neighbors.left.marker == mkr){
              objCount.left++;
              checkLeft(slot.neighbors.left);
            }
          }
        }
        var checkUp = function(slot){
          if(slot.neighbors.up){
            if(slot.neighbors.up.marker == mkr){
              objCount.up++;
              checkUp(slot.neighbors.up)
            }
          }
        }
        var checkRight = function(slot){
          if(slot.neighbors.right){
            if(slot.neighbors.right.marker == mkr){
              objCount.right++;
              checkRight(slot.neighbors.right)
            }
          }
        }
        var checkdown = function(slot){
          if(slot.neighbors.down){
            if(slot.neighbors.down.marker == mkr){
              objCount.down++;
              checkdown(slot.neighbors.down)
            }
          }
        }
        var checkLeftUp = function(slot){
          if(slot.neighbors.left && slot.neighbors.left.neighbors.up){
            if(slot.neighbors.left.neighbors.up.marker == mkr){
              objCount.leftUp++;
              checkLeftUp(slot.neighbors.left.neighbors.up)
            }
          }
        }
        var checkRightUp = function(slot){
          if(slot.neighbors.right && slot.neighbors.right.neighbors.up){
            if(slot.neighbors.right.neighbors.up.marker == mkr){
              objCount.rightUp++;
              checkRightUp(slot.neighbors.right.neighbors.up)
            }
          }
        }
        var checkRightDown = function(slot){
          if(slot.neighbors.right && slot.neighbors.right.neighbors.down){
            if(slot.neighbors.right.neighbors.down.marker == mkr){
              objCount.rightDown++;
              checkRightDown(slot.neighbors.right.neighbors.down)
            }
          }
        }
        var checkLeftDown = function(slot){
          if(slot.neighbors.left && slot.neighbors.left.neighbors.down){
            if(slot.neighbors.left.neighbors.down.marker == mkr){
              objCount.leftDown++;
              checkLeftDown(slot.neighbors.left.neighbors.down)
            }
          }
        }

        checkLeft(board[i]);
        checkUp(board[i]);
        checkRight(board[i]);
        checkdown(board[i]);

        checkLeftUp(board[i]);
        checkRightUp(board[i]);
        checkRightDown(board[i]);
        checkLeftDown(board[i]);
        console.log(board[i], mkr, objCount);
        
        // win move scenarios
        var pushWinPosition = function(){
          console.log("pushing win position ", board[i].position, mkr);
          mkr == x ? winMovesComputer.push(board[i]) : winMovesUser.push(board[i]);
        }
        if(objCount.left + objCount.right == 2){
          pushWinPosition();
        }
        if(objCount.leftUp + objCount.rightDown == 2){
          pushWinPosition();
        }
        if(objCount.leftDown + objCount.rightUp == 2){
          pushWinPosition();
        }
        if(objCount.up + objCount.down == 2){
          pushWinPosition();
        }

      }
    }

  }
  var checkMoveOptionsComputer = function(){
    checkMoveOptions(x)
  }
  var checkMoveOptionsUser = function(){
    checkMoveOptions(o)
  }

  var cornerMoveDoesNotForceUserFork = function(){
    console.log('*** to be coded, temporarily not checking*******');
    return true;
  }

  // Begin Computer check for scenarios
  checkMoveOptionsComputer();
  checkMoveOptionsUser()
    
    if(winMovesComputer.length > 0){
      winMovesComputer[0].marker = x;
      winner = "Computer wins!";
    }
    else if(winMovesUser.length > 0){
      winMovesUser[0].marker = x;
    }
    else if (forkMovesComputer.length > 0){
      console.log('selecting forkMoves Computer')
    }
    else if(forkMovesUser.length > 0){
      console.log('selecting forkMoves User')
    }
    else if(board[8].marker == blank){
      console.log('choosing center')
      board[8].marker = x;
    }
    else if(availCorners.length > 0 && cornerMoveDoesNotForceUserFork()){
      console.log('choosing a corner');
      selectRandom(availCorners);
    }
    else if(availSides.length > 0){
      console.log('choosing a side');
      selectRandom(availSides);
    }
    else{
      console.log('no sides')
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
  startButton.style.opacity = 0;
  document.getElementById('win-message').style.display = "none";
  document.getElementById('tie-message').style.display = "none";
  document.getElementById('board-container').style.opacity = 1;
  updateGame()
}

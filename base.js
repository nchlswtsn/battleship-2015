go()
var usa = true
function go() {
  if (usa){
    var userId = "USA";
    usa = false;
  }else {
    userId = "USSR";
  }
  var fireRef = new Firebase("https://battleship-2015.firebaseio.com/");
  assignPlayerNumberAndPlayGame(userId, fireRef);
};

// The maximum number of players.  If there are already
// NUM_PLAYERS assigned, users won't be able to join the game.
var NUM_PLAYERS = 2;

// The root of your game data.
var GAME_LOCATION = 'https://battleship-2015.firebaseio.com/';

// A location under GAME_LOCATION that will store the list of
// players who have joined the game (up to MAX_PLAYERS).
var PLAYERS_LOCATION = 'player_list';

// A location under GAME_LOCATION that you will use to store data
// for each player (their game state, etc.)
var PLAYER_DATA_LOCATION = 'player_data';


// Called after player assignment completes.
function playGame(myPlayerNumber, userId, justJoinedGame, fireRef) {
  var playerDataRef = fireRef.child(PLAYER_DATA_LOCATION).child(myPlayerNumber);
  if (justJoinedGame) {
    playerDataRef.set({userId: userId, state: 'game state'});
  }
}

// Use transaction() to assign a player number, then call playGame().
function assignPlayerNumberAndPlayGame(userId, fireRef) {
  var playerListRef = fireRef.child(PLAYERS_LOCATION);
  var myPlayerNumber, alreadyInGame = false;

  playerListRef.transaction(function(playerList) {
    // Attempt to (re)join the given game. Notes:
    //
    // 1. Upon very first call, playerList will likely appear null (even if the
    // list isn't empty), since Firebase runs the update function optimistically
    // before it receives any data.
    // 2. The list is assumed not to have any gaps (once a player joins, they
    // don't leave).
    // 3. Our update function sets some external variables but doesn't act on
    // them until the completion callback, since the update function may be
    // called multiple times with different data.
    if (playerList === null) {
      playerList = [];
    }

    for (var i = 0; i < playerList.length; i++) {
      if (playerList[i] === userId) {
        // Already seated so abort transaction to not unnecessarily update playerList.
        alreadyInGame = true;
        myPlayerNumber = i; // Tell completion callback which seat we have.
        return;
      }
    }

    if (i < NUM_PLAYERS) {
      // Empty seat is available so grab it and attempt to commit modified playerList.
      playerList[i] = userId;  // Reserve our seat.
      myPlayerNumber = i; // Tell completion callback which seat we reserved.
      return playerList;
    }

    // Abort transaction and tell completion callback we failed to join.
    myPlayerNumber = null;
  }, function (error, committed) {
    // Transaction has completed.  Check if it succeeded or we were already in
    // the game and so it was aborted.
    if (committed || alreadyInGame) {
      playGame(myPlayerNumber, userId, !alreadyInGame, fireRef);
    } else {
      alert('Game is full.  Can\'t join. :-(');
    }
  });
}

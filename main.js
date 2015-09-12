"use strict";
var fireRef = new Firebase("https://battleship-2015.firebaseio.com/");

function init(){
  var rotated = false
  var $quare = $(".PlayBoard td"),
  shipPlacements = [];
  for (var i =0; i<100;i++){
    shipPlacements.push(false);
  }
  function preGame(){
    $("#rotate").on("click", function(){
      rotated = rotated ? false : true
    })
    var shipsToPlace = 5;
    $quare.hover(highlightPlacement);
    $quare.on("click", placeShips);

    function isValid(tiles){
        var valid=true
      tiles.forEach(function(tile){
        if (tile.hasClass("ship")){
          valid = false;
        }
      })
      return valid;
    }

    function placeShips(){
      if(shipsToPlace){
        var $placement = $(this),
        tiles = getTiles($placement)
        if (isValid(tiles)){
          tiles.forEach(function(tile){
            tile.addClass("ship").off();
            shipPlacements[tile.data("id")]=true;
          });
          if(!(--shipsToPlace)){
            $quare.off()
            gameBegin()
          }
        }
      }

    }
    function highlightPlacement(){
      var $placement = $(this),
      tiles = getTiles($placement);
      if(isValid(tiles)){
        tiles.forEach(function(tile){
          tile.toggleClass("highlight");
        });
      }
    }
  }

  function getTiles(placement){
    var secondTile,
    firstTile;
    if (!rotated){
      if (placement.context["cellIndex"]===9){
        secondTile = placement.prev().prev()
        firstTile = placement.prev()
      } else if(placement.context["cellIndex"]===0){
        firstTile = placement.next().next()
        secondTile = placement.next()
      }else{
        firstTile = placement.next()
        secondTile = placement.prev()
      }
    }
    else{
      if (placement.data("id")<10){
        var x = placement.data("id")+10;
        var y = placement.data("id")+20;
        firstTile = $("td.player[data-id='" + x+ "']");
        secondTile = $("td.player[data-id='" + y+ "']");
      }else if(placement.data("id")>90){
        var x = placement.data("id")-10;
        var y = placement.data("id")-20;
        firstTile = $("td.player[data-id='" + x+ "']");
        secondTile = $("td.player[data-id='" + y+ "']");
      }else{
        var x = placement.data("id")-10;
        var y = placement.data("id")+10;
        firstTile = $("td.player[data-id='" + x+ "']");
        secondTile = $("td.player[data-id='" + y+ "']");
      }
    }
    var tiles = []
    tiles.push(firstTile, secondTile, placement)
    return tiles
  }

  function gameBegin(){
    $("#rotate").remove()
    var gameSet = fireRef.child("shipLocations");
    gameSet.set({
      shipLocations: shipPlacements
    })
    $(".OppBoard td").click(hitOrNah)

    function hitOrNah(e){
      var hits = 0
      var $guessedSquare = $(this);
      var squareVal = $guessedSquare.data("id");
      fireRef.once('value', function(dataSnapshot){
        var hit;
        var ob = dataSnapshot.val();
        hit = ob.shipLocations.shipLocations[squareVal]
        if(hit){
          $guessedSquare.addClass("hit");
          hits++
        }
        else {
          $guessedSquare.addClass("miss");
        }
      })
    }
  }
  preGame()
}

// function

// function go() {
//   var userId = prompt('Username?', 'Guest');
//   var fireRef = new Firebase("https://battleship-2015.firebaseio.com/");
//   assignPlayerNumberAndPlayGame(userId, fireRef);
// };
//
// // The maximum number of players.  If there are already
// // NUM_PLAYERS assigned, users won't be able to join the game.
// var NUM_PLAYERS = "2";
//
// // The root of your game data.
// var GAME_LOCATION = 'https://battleship-2015.firebaseio.com/';
//
// // A location under GAME_LOCATION that will store the list of
// // players who have joined the game (up to MAX_PLAYERS).
// var PLAYERS_LOCATION = 'player_list';
//
// // A location under GAME_LOCATION that you will use to store data
// // for each player (their game state, etc.)
// var PLAYER_DATA_LOCATION = 'player_data';
//
//
// // Called after player assignment completes.
// function playGame(myPlayerNumber, userId, justJoinedGame, fireRef) {
//   var playerDataRef = fireRef.child(PLAYER_DATA_LOCATION).child(myPlayerNumber);
//   if (justJoinedGame) {
//     playerDataRef.set({userId: userId, state: 'game state'});
//   }
// }
//
// // Use transaction() to assign a player number, then call playGame().
// function assignPlayerNumberAndPlayGame(userId, fireRef) {
//   var playerListRef = fireRef.child(PLAYERS_LOCATION);
//   var myPlayerNumber, alreadyInGame = false;
//
//   playerListRef.transaction(function(playerList) {
//     // Attempt to (re)join the given game. Notes:
//     //
//     // 1. Upon very first call, playerList will likely appear null (even if the
//     // list isn't empty), since Firebase runs the update function optimistically
//     // before it receives any data.
//     // 2. The list is assumed not to have any gaps (once a player joins, they
//     // don't leave).
//     // 3. Our update function sets some external variables but doesn't act on
//     // them until the completion callback, since the update function may be
//     // called multiple times with different data.
//     if (playerList === null) {
//       playerList = [];
//     }
//
//     for (var i = 0; i < playerList.length; i++) {
//       if (playerList[i] === userId) {
//         // Already seated so abort transaction to not unnecessarily update playerList.
//         alreadyInGame = true;
//         myPlayerNumber = i; // Tell completion callback which seat we have.
//         return;
//       }
//     }
//
//     if (i < NUM_PLAYERS) {
//       // Empty seat is available so grab it and attempt to commit modified playerList.
//       playerList[i] = userId;  // Reserve our seat.
//       myPlayerNumber = i; // Tell completion callback which seat we reserved.
//       return playerList;
//     }
//
//     // Abort transaction and tell completion callback we failed to join.
//     myPlayerNumber = null;
//   }, function (error, committed) {
//     // Transaction has completed.  Check if it succeeded or we were already in
//     // the game and so it was aborted.
//     if (committed || alreadyInGame) {
//       playGame(myPlayerNumber, userId, !alreadyInGame, fireRef);
//     } else {
//       alert('Game is full.  Can\'t join. :-(');
//     }
//   });
// }
















$(document).ready(init);

"use strict";
var battleshipRef = new Firebase("https://basedgod.firebaseio.com/");
var themesong = new Audio("battlesongless.wav");
var playersRef = battleshipRef.child('players');
var turnRef = battleshipRef.child('turn');
let placementDoneRef = battleshipRef.child('placementDoneRef')
let numPlayers, isOn = false, selfRefKey, selfRef, opponentRef, playerKeys, selfBoardRef, playerNum;


function init(){
  var $square = $(".PlayBoard td");
  let $playerDiv = $("#playerDiv")
  playersRef.on('value', (snap)=> {
    numPlayers = snap.numChildren();
    if (numPlayers === 2){
      playerKeys = snap.val();
      preGame();
      playersRef.off();
      $playerDiv.text("Place your ships and wait for opponent to place his/hers!")
    }
  })
  let $addPlayer = $("#addPlayer");
  $addPlayer.on('click', function(event){
    event.preventDefault();
    addPlayer();
    $addPlayer.remove()
  })
  let shipPlacements = [];
  for (var i =0; i<100;i++){
    shipPlacements.push(false);
  }

  function addPlayer () {
    if (numPlayers < 2){
      $playerDiv.text("Waiting for another player, or open a new window to play against yourself!")
      playerNum = (numPlayers === 0) ? 1 : 2;
      selfRef = playersRef.push("player" +playerNum);
      selfRefKey = selfRef.path.o[1];
      playersRef.child(selfRefKey).onDisconnect().remove();
    }
    else alert("Too many players");
  }



  var rotated = false;
  function preGame(){
    $("#rotate").removeClass('hidden')
    $("#rotate").on("click", function(){
      rotated = !rotated
    })
    var shipsToPlace = 5;
    $square.hover(highlightPlacement);
    $square.on("click", placeShips);

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
            $square.off();
            $playerDiv.text("Wait for your opponent to place!");
            assignPlayers();
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
        firstTile = $("td.player[data-id='" + x + "']");
        secondTile = $("td.player[data-id='" + y + "']");
      }else if(placement.data("id")>90){
        var x = placement.data("id")-10;
        var y = placement.data("id")-20;
        firstTile = $("td.player[data-id='" + x + "']");
        secondTile = $("td.player[data-id='" + y + "']");
      }else{
        var x = placement.data("id")-10;
        var y = placement.data("id")+10;
        firstTile = $("td.player[data-id='" + x + "']");
        secondTile = $("td.player[data-id='" + y + "']");
      }
    }
    var tiles = []
    tiles.push(firstTile, secondTile, placement)
    return tiles
  }

  function assignPlayers() {

    placementDoneRef.on('value', (snap)=> {
      if (snap.numChildren() === 2){
        gameBegin()
        placementDoneRef.off()
        turnRef.set({
          playerOne: 1
        });
      }
    })
    for (let key in playerKeys){
      if (key !== selfRefKey){
        opponentRef = playersRef.child(key)
      }
    }
    selfBoardRef = selfRef.set({
      shipLocations: shipPlacements
    })
    let tempKey = placementDoneRef.push(true).path.o[1];
    placementDoneRef.child(tempKey).onDisconnect().remove()
  }


  function gameBegin(){
    themesong.play();
    let oppBoardRef = opponentRef.child('shipLocations');
    let oppGuessRef = opponentRef.child('guess');
    $("#opp-board-message").text("Make your guess here!");
    let hitsTaken = 0;
    oppGuessRef.on('value', snap => {
      let guess = snap.val()
      let guessedSquare = $square[guess["key"]]
      if(guess.hit) hitsTaken++
      guessedSquare.className += guess.hit ? " hit" : " miss"
      if(hitsTaken === 15) {
        loseScenario();
      }
    });
    $("#rotate").remove();
    let currentPlayerTurn;
    turnRef.on('value', (snap)=> {
      let turnVal = snap.val().playerOne;
      currentPlayerTurn = turnVal;
      $playerDiv.text(currentPlayerTurn === playerNum ? "Your turn!" : "Opponent's turn!");
    });
    var hits =0;


    var $OppBoard = $(".OppBoard td");
    $OppBoard.click(hitOrNah);

    function hitOrNah(e){
      e.preventDefault()
      if(currentPlayerTurn === playerNum){
        currentPlayerTurn = currentPlayerTurn === 1 ? 2 : 1;
        turnRef.set({
          playerOne: currentPlayerTurn
        });


        var splash = new Audio("splash.wav");
        var explosion = new Audio("explosion.wav");
        var $guessedSquare = $(this);
        var squareVal = $guessedSquare.data("id");

        oppBoardRef.once('value', snap=>{
          let hit = snap.val()[squareVal];
          let guess = {key: squareVal, hit: hit};
          let selfGuessRef = selfRef.update({
            guess: guess
          })
          if(hit){
            explosion.play();
            $guessedSquare.addClass("hit").off();
            hits++;
            if(hits === 15){
              winScenario();
            }
          }
          else {
            $guessedSquare.addClass("miss").off();
            splash.play();
          }
        })
      }
      else {
        $playerDiv.text("Not your turn!");
        $('body').fadeOut(100).fadeIn(100);
      }
    }
    let winScenario = () =>{
      $OppBoard.off()
      alert('You Win!')
      $playerDiv.text("Winner!");
    }
    let loseScenario = () =>{
      $OppBoard.off()
      alert('You lose!')
      $playerDiv.text("Loser!");
    }
  }
}






$(document).ready(init);

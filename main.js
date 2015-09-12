"use strict";
// var fireRef = new Firebase("https://battleship-2015.firebaseio.com/");

function init(){
  var $quare = $(".PlayBoard td"),
  shipPlacements = [];
  for (var i =0; i<100;i++){
    shipPlacements.push(false);
  }
  console.log(shipPlacements);
  function preGame(){
    var shipsToPlace = 5;
    $quare.hover(highlightPlacement);
    $quare.on("click", placeShips);

    function placeShips(e){
      // player can place ship in other ship if placed adjacent
      if(shipsToPlace){
        var $placement = $(this),
        tiles = getTiles($placement)
        tiles.forEach(function(tile){
          tile.addClass("ship");
          shipPlacements[tile.data("id")]=true;
        });
        console.log(shipPlacements);
        if(!(--shipsToPlace)){
          $quare.off()
          gameBegin
        }
      }

    }
    function highlightPlacement(){
      var $placement = $(this),
      tiles = getTiles($placement);
      tiles.forEach(function(tile){
        tile.toggleClass("highlight");
      });
    }
  }

  function getTiles(placement){
    var secondTile,
    firstTile;
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
    var tiles = []
    tiles.push(firstTile, secondTile, placement)
    return tiles
  }

  function gameBegin(){
    $quare.click(hitOrNah)

    function hitOrNah(e){
      var $guessedSquare = $(this);
      var squareVal = $guessedSquare.data("id")
      //some firebase to determine if square is hit

      if (hit){
        $guessedSquare.addClass("hit");
      }
      else {
        $guessedSquare.addClass("miss");
      }
    }

  }
  preGame()

}


var fakeOponentArray = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, false, false, false, true, true, true, false, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true]














$(document).ready(init);

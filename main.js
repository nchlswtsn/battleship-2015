"use strict";
// var fireRef = new Firebase("https://battleship-2015.firebaseio.com/");

function init(){
  var $quare = $(".PlayBoard td");
  function preGame(){
    var shipsToPlace = 5,
    shipPlacements = [];
    $quare.hover(highlightPlacement);
    $quare.on("click", placeShips);

    function placeShips(e){
      //player can place ship in other ship if placed adjacent
      if(shipsToPlace){
        var $placement = $(this),
        tiles = getTiles($placement)
        tiles.forEach(function(tile){
          tile.addClass("ship");
          var obj={row: tile.parent().data("id"), col: tile.data("id")}
          shipPlacements.push(obj)
        });
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
      console.log(placement.data("id"));
      var secondTile,
      firstTile;
      if (placement.data("id")===10){
        secondTile = placement.prev().prev()
        firstTile = placement.prev()
        console.log(secondTile);
      } else if(placement.data("id")===1){
        firstTile = placement.next().next()
        secondTile = placement.next()
      }else{
        firstTile = placement.next()
        secondTile = placement.prev()
      }
      var tiles = []
        tiles.push(firstTile, secondTile, placement)
        console.log(tiles);
      return tiles
    }

  function gameBegin(){
    $quare.click(hitOrNah)

    function hitOrNah(e){
      var $guessedSquare = $(this)
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















$(document).ready(init);

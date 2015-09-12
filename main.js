"use strict";
// var fireRef = new Firebase("https://battleship-2015.firebaseio.com/");

function init(){
  var $quare = $("td.player");
  function preGame(){
    var shipsToPlace = 5;
    $quare.hover(highlightPlacement);
    // $quare.on("mouseleave", dehighlightPlacement)
    $quare.on("click", placeShips);

    function placeShips(e){
      console.log(shipsToPlace);
      if(shipsToPlace){
        var $placement = $(this),
        tiles = getObject($placement)
        tiles["firstTile"].addClass("ship");
        tiles["secondTile"].addClass("ship");
        tiles["initialTile"].addClass("ship");
        if(!(--shipsToPlace)){
          $quare.off()
          gameBegin
        }
      }

    }
    function highlightPlacement(){
      var $placement = $(this),
      tiles = getObject($placement);
      tiles["firstTile"].toggleClass("highlight");
      tiles["secondTile"].toggleClass("highlight");
      tiles["initialTile"].toggleClass("highlight");
    }
  }

  function getObject(placement){
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
      var obj = {
        firstTile: firstTile, secondTile: secondTile, initialTile: placement
      }
      console.log(obj);
      return obj
    }

  function gameBegin(){
    $quare.click(hitOrNah)

    function hitOrNah(e){
      var $guessedSquare = $(this)
      //some firebending to determine if square is hit
      if (hit){
        $guessedSquare.addClass("hit");
      }
      else {
        $guessedSquare.addClass("hit");
      }
    }

  }
  preGame()

}















$(document).ready(init);

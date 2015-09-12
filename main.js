"use strict";
// var fireRef = new Firebase("https://battleship-2015.firebaseio.com/");

function init(){
  var $quare = $("td");
  function preGame(){
    var shipsToPlace = 5;
    $quare.hover(highlightPlacement);
    // $quare.on("mouseleave", dehighlightPlacement)
    $quare.on("click", placeShips);

    function placeShips(e){
      console.log(shipsToPlace);
      if(shipsToPlace){
        var $placement = $(this),
        $firstTile,
        $econdTile;
        if ($placement.next()["length"]===0){
          $econdTile = $placement.prev().prev()
          $firstTile = $placement.prev()
        } else if($placement.prev()["length"]===0){
          $firstTile = $placement.next().next()
          $econdTile = $placement.next()
        }else{
          $firstTile = $placement.next()
          $econdTile = $placement.prev()
        }
        $firstTile.addClass("ship").off();
        $econdTile.addClass("ship").off();
        $placement.addClass("ship").off();
        if(!(--shipsToPlace)){
          $quare.off()
          gameBegin
        }
      }

    }

    function highlightPlacement(){
      var $placement = $(this),
      $firstTile,
      $econdTile;
      if ($placement.next()["length"]===0){
        $econdTile = $placement.prev().prev()
        $firstTile = $placement.prev()
      } else if($placement.prev()["length"]===0){
        $firstTile = $placement.next().next()
        $econdTile = $placement.next()
      }else{
        $firstTile = $placement.next()
        $econdTile = $placement.prev()
      }
      $firstTile.toggleClass("highlight");
      $econdTile.toggleClass("highlight");
      $placement.toggleClass("highlight");
    }
  }

  function getObject(placement){

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

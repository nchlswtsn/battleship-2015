"use strict";
var fireRef = new Firebase("https://battleship-2015.firebaseio.com/");

function init(){
  var rotated = false
  var $quare = $(".PlayBoard td"),
  shipPlacements = [];
  $("#rotate").on("click", function(){
    rotated = rotated ? false : true
  })
  for (var i =0; i<100;i++){
    shipPlacements.push(false);
  }
  function preGame(){
    var shipsToPlace = 5;
    $quare.hover(highlightPlacement);
    $quare.on("click", placeShips);

    function placeShips(e){
      // player can place ship in other ship if placed adjacent
      if(shipsToPlace){
        var $placement = $(this),
        tiles = getTiles($placement)
        console.log(tiles);
        var validPlacement =true
        tiles.forEach(function(tile){
          if (tile.hasClass("ship")){
            validPlacement = false;
          }
        })
        if (validPlacement){

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
      tiles.forEach(function(tile){
        tile.toggleClass("highlight");
      });
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
    console.log(firstTile.data("id"));
    console.log(secondTile.data("id"));
    var tiles = []
    tiles.push(firstTile, secondTile, placement)
    return tiles
  }

  function gameBegin(){
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

















$(document).ready(init);

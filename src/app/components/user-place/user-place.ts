import { Component, inject } from '@angular/core';
import { Game } from '../../services/game';

@Component({
  selector: 'app-user-place',
  imports: [],
  templateUrl: './user-place.html',
  styleUrl: './user-place.scss'
})
export class UserPlace {
  gameService = inject(Game)

  isDoubled = false
  isStanded = false


  double() {
    if(this.gameService.boxValue() *2 > this.gameService.user().balance){
      alert("You don't have enough money for double.")
      return
    }

    this.gameService.boxList.set(this.gameService.boxList().flatMap(i => [i, i]))
    this.isDoubled = true
    this.hit()
    this.stand()
  }

  split() {
    this.gameService.user().secondHand = [this.gameService.user().hand[1]]
    this.gameService.user().secondHandValue = this.gameService.user().hand[1].value

    this.gameService.user().handValue = this.gameService.user().hand[1].value
    this.gameService.user().hand.pop()

  }

  stand() {
    console.log(this.gameService.selectedHand())

    //Csak akkor fog egybol kovetkezni a dealer ha egy kezzel jatszunk
    if(this.gameService.user().secondHand.length == 0){
      this.gameService.dealersRound()
      this.isStanded = true
    }
    //ha mar spliteltunk
    else {
      //ha mar a hand2-vel standelunk akkor jon csak kovinek a dealer
      if(this.gameService.selectedHand() == "hand2"){
        console.log("a hand2 standelt, a dealer kovetkezik  ")
        this.gameService.dealersRound()
        this.isStanded = true
      }
      //ha 2 kezzel jatszunk es az hand1-el standalunk akkor atvalt a hand2-re
      else {
        console.log("a hand1 standelt, valtas a hand2-re")
        this.gameService.selectedHand.set("hand2")
      }
    }

  }

  hit() {
    let randomIndex = Math.floor(Math.random() * this.gameService.deck.length)
    let selectedCard = this.gameService.deck[randomIndex];

    if (selectedCard.name.includes("ace")) {
      if (this.gameService.user().getWantedHandValue(this.gameService.selectedHand()) + 11 <= 21) {
        selectedCard.value = 11
      } else {
        selectedCard.value = 1
      }
    }

    //hozzaadja az adott kezhez
    this.gameService.user().addCardToHand(selectedCard, this.gameService.selectedHand())
    this.gameService.deck.splice(randomIndex, 1)

    console.log(this.gameService.user().getWantedHandValue(this.gameService.selectedHand()))

    //Ha spliteltunk
    if(this.gameService.user().secondHand.length != 0){
      //ha a hand1 teli van/eri el a 21et
      if(this.gameService.user().getWantedHandValue("hand1") >= 21 && this.gameService.selectedHand() == "hand1"){
        // Valtunk a hand2-re
        console.log("besokal a hand1. valtunk a hand2-re")
        this.gameService.selectedHand.set("hand2")
      }
      //ha a hand2 teli van/eri el a 21et
      else if (this.gameService.user().getWantedHandValue("hand2") >= 21 && this.gameService.selectedHand() == "hand2"){
        console.log("besokal a hand2. kezdodik a dealer kore")
        this.gameService.dealersRound()
      }
    //Ha nem spliteltunk akkor nezi csak a hand1-et nezi meg
    } else {
      this.gameService.checkRoundEnd("hit", this.gameService.user().hand, "hand1")
      if (this.gameService.user().handValue == 21){
        this.gameService.dealersRound()
      }
    }


  }
}

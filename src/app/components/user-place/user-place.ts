import { Component, inject, OnInit, output, Signal } from '@angular/core';
import { Game } from '../../services/game';
import { User } from '../../models/user.model';
import { Chips } from '../../models/chips.model';

@Component({
  selector: 'app-user-place',
  imports: [],
  templateUrl: './user-place.html',
  styleUrl: './user-place.scss'
})
export class UserPlace implements OnInit {
  gameService = inject(Game)
  // user!: Signal<User>

  isDoubled = false
  isStanded = false


  ngOnInit(): void {
    // this.user = this.gameService.user
  }

  double() {
    if(this.gameService.boxValue() *2 > this.gameService.user().balance){
      alert("You don't have enough money for double.")
      return
    }

    this.gameService.boxList.set(this.gameService.boxList().flatMap(i => [i, i]))
    this.isDoubled = true
    this.hit()
  }

  split() { }

  stand() {
    // this.gameService.roundOver = true
    this.isStanded = true
    this.gameService.dealersRound()
  }

  hit() {
    let randomIndex = Math.floor(Math.random() * this.gameService.deck.length)
    let selectedCard = this.gameService.deck[randomIndex];

    if (selectedCard.name.includes("ace")) {
      if (this.gameService.user().handValue + 11 <= 21) {
        selectedCard.value = 11
      } else {
        selectedCard.value = 1
      }
    }

    this.gameService.user().addCardToHand(selectedCard)
    this.gameService.deck.splice(randomIndex, 1)

    this.gameService.checkRoundEnd("hit")

    if (this.gameService.user().handValue == 21){
      this.gameService.dealersRound()
    }
  }
}

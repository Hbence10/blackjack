import { Component, inject, OnInit } from '@angular/core';
import { Game } from '../../services/game';
import { Hand } from './../../models/hand.model';

@Component({
  selector: 'app-user-place',
  imports: [],
  templateUrl: './user-place.html',
  styleUrl: './user-place.scss'
})
export class UserPlace implements OnInit{
  gameService = inject(Game)
  handRows: Hand[][] = []

  ngOnInit(): void {
    this.setHandRows()
  }

  double() {
    if(this.gameService.user.handList[this.gameService.user.actualHandIndex].value *2 > this.gameService.user.balance){
      alert("You don't have enough money for double!")
      return
    }

    this.gameService.boxList.set(this.gameService.boxList().flatMap(i => [i, i]))
    this.gameService.user.handList[this.gameService.user.actualHandIndex].bet = (this.gameService.user.handList[this.gameService.user.actualHandIndex].bet * 2)
    this.gameService.user.handList[this.gameService.user.actualHandIndex].isDoubled = true

    this.hit()
  }

  split() {
    const actaulHand: Hand = this.gameService.user.handList[this.gameService.user.actualHandIndex]

    const newHand = new Hand([actaulHand.cardList[1]], actaulHand.cardList[1].value, actaulHand.bet)

    this.gameService.user.handList[this.gameService.user.actualHandIndex].removeCard()
    this.gameService.user.addHand(newHand)

    this.setHandRows()
  }

  stand() {
    this.gameService.user.handList[this.gameService.user.actualHandIndex].isStanded = true

    if(this.gameService.user.actualHandIndex + 1 == this.gameService.user.handList.length){
      this.gameService.dealersRound()
    }
    else {
      this.gameService.user.actualHandIndex = (this.gameService.user.actualHandIndex + 1)
      console.log(this.gameService.user.handList[this.gameService.user.actualHandIndex])
    }
  }

  hit() {
    let randomIndex = Math.floor(Math.random() * this.gameService.deck.length)
    let selectedCard = this.gameService.deck[randomIndex];

    if (selectedCard.name.includes("ace")) {
      if (this.gameService.user.handList[this.gameService.user.actualHandIndex].value + 11 <= 21) {
        selectedCard.value = 11
      } else {
        selectedCard.value = 1
      }
    }

    this.gameService.user.handList[this.gameService.user.actualHandIndex].addCard(selectedCard)
    console.log(this.gameService.user.handList[this.gameService.user.actualHandIndex])


    if(this.gameService.user.actualHandIndex + 1 == this.gameService.user.handList.length){
      if(this.gameService.user.handList[this.gameService.user.actualHandIndex].value >= 21){
        this.gameService.dealersRound()
      }
    } else {
      // this.gameService.user.handList[this.gameService.user.actualHandIndex].addCard(selectedCard)
      if(this.gameService.user.handList[this.gameService.user.actualHandIndex].value >= 21){
        this.gameService.user.actualHandIndex = (this.gameService.user.actualHandIndex + 1 )
      }
    }

    this.setHandRows()
  }

  setHandRows(){
    this.handRows = []
    for(let i: number = 0; i < this.gameService.user.handList.length; i+= 2){
      const handRow: Hand[] = []
      for (let j: number = i; j< i+2; j++){
        handRow.push(this.gameService.user.handList[j])
      }
      this.handRows.push(handRow)
    }
  }
}

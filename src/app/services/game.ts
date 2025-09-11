import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Card } from '../models/card.model';
import { Chips } from '../models/chips.model';
import { Hand } from '../models/hand.model';
import { ResultDetails } from '../models/result.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Game {
  router = inject(Router)
  deck: Card[] = []
  user = new User("user", 50)
  dealer = new User("dealer", 10000000)
  chipsList = signal<Chips[]>([]);
  gameStarted: boolean = false

  roundOver: boolean = false
  showResultPage: boolean = false

  boxList = signal<Chips[]>([])
  boxValue = computed(() => {
    let sum = 0;
    this.boxList().forEach(chip => sum += chip.value)
    return sum
  });

  resultList: ResultDetails[] = []

  constructor() {
    this.setDeck()
    this.createMoneyChips()
  }

  setDeck() {
    const symbols: string[] = ["clubs", "diamonds", "hearts", "spades"]
    const values: (string | number)[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, "ace", "king", "queen", "jack"]
    const specialCards: string[] = ["king", "queen", "jack"]

    for (let i: number = 0; i < symbols.length; i++) {
      for (let j: number = 0; j < values.length; j++) {
        let value: number | number[];

        if (specialCards.includes(String(values[j]))) {
          value = 10
        } else if (values[j] == "ace") {
          value = 11
        } else {
          value = Number(values[j])
        }

        this.deck.push(new Card(
          `${values[j]}_of_${symbols[i]}`,
          value,
          symbols[i],
          `assets/cards/${values[j]}_of_${symbols[i]}.png`
        ))
      }
    }
  }

  createMoneyChips() {
    const chipsValues: number[] = [1, 5, 10, 25, 50, 100, 500]
    for (let i: number = 0; i < chipsValues.length; i++) {
      this.chipsList().push(new Chips(chipsValues[i], `assets/moneys/${chipsValues[i]}.png`))
    }
  }

  setStartPage() {
    this.gameStarted = true
    const userCardList: Card[] = []
    let userHandValue: number = 0

    for (let i: number = 0; i < 2; i++) {
      let randomIndex = Math.floor(Math.random() * this.deck.length)
      let selectedCard = this.deck[randomIndex]

      if(selectedCard.name.includes("ace")){
        if (userHandValue + 11 <= 21){
          selectedCard.value = 11
        } else {
          selectedCard.value = 1
        }
      }

      userHandValue += selectedCard.value
      userCardList.push(selectedCard)
      this.deck.splice(randomIndex, 1)
    }
    this.user.addHand(new Hand(userCardList, userHandValue, this.boxValue()))
    this.checkRoundEnd("start", this.user.handList[this.user.actualHandIndex], 0)

    const dealerCardList: Card[] = []
    let dealerHandValue: number = 0
    for (let i: number = 0; i < 2; i++) {
      let randomIndex = Math.floor(Math.random() * this.deck.length)
      let selectedCard = this.deck[randomIndex]
      if(selectedCard.name.includes("ace")){
        if (dealerHandValue + 11 <= 21){
          selectedCard.value = 11
        } else {
          selectedCard.value = 1
        }
      }

      dealerCardList.push(selectedCard)
      dealerHandValue += selectedCard.value
      this.deck.splice(randomIndex, 1)
    }
    dealerCardList[0].isUpsideDown = true
    this.dealer.addHand(new Hand(dealerCardList, dealerHandValue, 0))
  }

  dealersRound() {
    this.dealer.handList[0].cardList[0].isUpsideDown = false

    if (this.dealer.handList[0].value >= 17) {
      // this.user.handList.forEach(hand => this.checkRoundEnd("dealersRound", hand, this.user.handList.indexOf(hand)))
      for (let i: number = 0; i < this.user.handList.length; i++) {
        this.checkRoundEnd("dealersRound", this.user.handList[i], i)
      }
      return
    }

    let randomIndex = Math.floor(Math.random() * this.deck.length)
    const selectedCard = this.deck[randomIndex]
    const dealerValue = this.dealer.handList[0].value

    if (selectedCard.name.includes("ace")) {
      if (dealerValue + 11 > 17 && dealerValue + 11 < 21) {
        selectedCard.value = 11
      } else if (dealerValue + 11 > 21) {
        selectedCard.value = 1
      }
    }

    this.dealer.handList[0].addCard(selectedCard)
    this.deck.splice(randomIndex, 1)

    while (this.dealer.handList[0].value < 17) {
      let randomIndex = Math.floor(Math.random() * this.deck.length)
      const selectedCard = this.deck[randomIndex]
      const dealerValue = this.dealer.handList[0].value

      if (selectedCard.name.includes("ace")) {
        if (dealerValue + 11 > 17 && dealerValue + 11 < 21) {
          selectedCard.value = 11
        } else if (dealerValue + 11 > 21) {
          selectedCard.value = 1
        }
      }

      this.dealer.handList[0].addCard(selectedCard)
      this.deck.splice(randomIndex, 1)
    }

    // this.user.handList.forEach(hand => this.checkRoundEnd("dealersRound", hand, this.user.handList.indexOf(hand)))
    for (let i: number = 0; i < this.user.handList.length; i++) {
      this.checkRoundEnd("dealersRound", this.user.handList[i], i)
    }
  }

  checkRoundEnd(afterEventName: "hit" | "dealersRound" | "start", hand: Hand, handIndex: number) {
    //Egyboli gyozelem:
    if (afterEventName == "start" && hand.value == 21) {
      this.setResultPage(hand.bet * 3, "Blackjack", handIndex)
      this.showResultPage = true
    } else if (afterEventName == "dealersRound") {
      //dontetlen,
      if (hand.value == this.dealer.handList[0].value) {
        this.setResultPage(hand.bet, "Push", handIndex)
      }
      //Mind a ketten 21 alatt vegeztek
      else if (hand.value < 21 && this.dealer.handList[0].value < 21) {
        //Ha a user van kozelebb
        if ((21 - hand.value) < (21 - this.dealer.handList[0].value)) {
          this.setResultPage(hand.bet * 2, "Victory", handIndex)
        }
        //Ha a dealer van kozelebb
        else if ((21 - hand.value) > (21 - this.dealer.handList[0].value)) {
          this.setResultPage(hand.value * -1, "Lose", handIndex)
        }
      }

      // az oszto meghaladja a 21-et
      else if (hand.value <= 21 && this.dealer.handList[0].value > 21) {
        this.setResultPage(hand.bet * 2, "Dealer bust", handIndex)
      }

      //A jatekos eri el a 21et
      else if (hand.value == 21) {
        console.log("asd")
        this.setResultPage(hand.bet * 2.5, "Victory", handIndex)
      }

      //A dealer eri el a 21et
      else if (this.dealer.handList[0].value == 21) {
        this.setResultPage(hand.value * -1, "Victory", handIndex)
      }

    } else if (afterEventName == "hit") {
      if (hand.value > 21) {
        this.setResultPage(0, "User's bust", handIndex)
      } else if (hand.value == 21) {
        this.setResultPage(hand.bet * 2.5, "Victory", handIndex)
      }
    }
  }

  checkGameOver() {
    if (this.user.balance <= 0) {
      this.router.navigate([""])
    }
  }

  setResultPage(prizeAmount: number, title: string, handIndex: number) {
    this.resultList.push(new ResultDetails(title, prizeAmount, handIndex))
  }

  saveUsersStatsToLocalStorage() {

  }

  setNewRound(){
    this.user.actualHandIndex = 0
    this.user.handList = []
    this.roundOver = false
    this.boxList.set([])
    this.dealer.actualHandIndex = 0
    this.dealer.handList = []

    this.setDeck()
    this.gameStarted = false
    this.resultList = []
  }
}

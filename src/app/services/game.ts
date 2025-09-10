import { computed, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Card } from '../models/card.model';
import { Chips } from '../models/chips.model';
import { Hand } from '../models/hand.model';

@Injectable({
  providedIn: 'root'
})
export class Game {
  deck: Card[] = []
  user = new User("user", 3000)
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

  resultObject!: { title: string, moneyResult: number };

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
      userCardList.push(selectedCard)
      userHandValue += selectedCard.value
      this.deck.splice(randomIndex, 1)
    }
    this.user.addHand(new Hand(userCardList, userHandValue, this.boxValue()))

    // const sameValues: Card[] = this.deck.filter(elements => elements.value == 3)
    // this.user.addHand(new Hand([sameValues[0], sameValues[1]], 6, this.boxValue()))

    this.checkRoundEnd("start", this.user.handList[this.user.actualHandIndex].cardList)

    const dealerCardList: Card[] = []
    let dealerHandValue: number = 0

    for (let i: number = 0; i < 2; i++) {
      let randomIndex = Math.floor(Math.random() * this.deck.length)
      dealerCardList.push(this.deck[randomIndex])
      dealerHandValue += this.deck[randomIndex].value
      this.deck.splice(randomIndex, 1)
    }
    dealerCardList[0].isUpsideDown = true
    this.dealer.addHand(new Hand(dealerCardList, dealerHandValue, 0))

    this.checkRoundEnd("start", this.user.handList[0].cardList)

    // this.deck = [sameValues[2], sameValues[3]]
  }

  dealersRound() {
    this.dealer.handList[0].cardList[0].isUpsideDown = false
    console.log(this.dealer)

    if (this.dealer.handList[0].value >= 17) {
      for (let i : number = 0; i < this.user.handList.length; i++){
        console.log(`hand${i}`)
        this.checkRoundEnd("dealersRound", this.user.handList[i].cardList)
      }
      return
    }

    let randomIndex = Math.floor(Math.random() * this.deck.length)
    this.dealer.handList[0].addCard(this.deck[randomIndex])
    this.deck.splice(randomIndex, 1)

    while (this.dealer.handList[0].value < 17) {
      randomIndex = Math.floor(Math.random() * this.deck.length)
      this.dealer.handList[0].addCard(this.deck[randomIndex])
      this.deck.splice(randomIndex, 1)
    }


    for (let i : number = 0; i < this.user.handList.length; i++){
      console.log(`hand${i}`)
      this.checkRoundEnd("dealersRound", this.user.handList[i].cardList)
    }
  }

  checkRoundEnd(afterEventName: "hit" | "dealersRound" | "start", hand: Card[]) {
    let handValue = 0;
    hand.forEach(element => handValue += element.value)

    //Egyboli gyozelem:
    if (afterEventName == "start" && handValue == 21) {
      console.log("osztas altal a user nyert")
      this.setResultPage(this.boxValue() * 3, "Blackjack")

    } else if (afterEventName == "dealersRound") {
      //dontetlen,
      if (handValue == this.dealer.handList[0].value) {
        console.log("dontetlen")
        this.setResultPage(this.boxValue(), "Push")
      }
      //Mind a ketten 21 alatt vegeztek
      else if (handValue < 21 && this.dealer.handList[0].value) {
        //Ha a user van kozelebb
        if ((21 - handValue) < (21 - this.dealer.handList[0].value)) {
          console.log("a user kozelebb van a 21-hez")
          this.setResultPage(this.boxValue() * 2, "Victory")
        }
        //Ha a dealer van kozelebb
        else if ((21 - handValue) > (21 - this.dealer.handList[0].value)) {
          console.log("a dealer kozelebb van a 21-heze")
          this.setResultPage(0, "Lose")
        }

      }
      // az oszto meghaladja a 21-et
      else if (handValue <= 21 && this.dealer.handList[0].value > 21) {
        console.log("Az oszto meghaladta a 21et")
        this.setResultPage(this.boxValue() * 2, "Dealer bust")
      }

      //A jatekos eri el a 21et
      else if (handValue == 21) {
        console.log("a user nyert")
        this.setResultPage(this.boxValue() * 2.5, "Victory")
      }

      //A dealer eri el a 21et
      else if (this.dealer.handList[0].value == 21) {
        console.log("a dealer nyert")
        this.setResultPage(0, "Victory")
      }

    } else if (afterEventName == "hit" && handValue > 21) {
      console.log("a user besokalt")
      this.setResultPage(0, "User's bust")
    }
  }

  // checkGameOver() {
  //   if (this.user().balance <= 0) {
  //     console.log("elfogyott a penzed!")
  //   }
  // }

  setResultPage(prizeAmount: number, title: string) {
    // this.showResultPage = true
    console.log(`a nyert osszeg: ${prizeAmount}`)
    // this.user().balance = this.user().balance + prizeAmount
    // this.resultObject = { moneyResult: prizeAmount, title: title }
    // this.checkGameOver()
    // this.saveUsersStatsToLocalStorage()
  }

  // setNewRound() {
  //   this.boxList.set([])
  //   this.user.set(
  //     new User("", [], this.user().balance)
  //   )
  //   this.gameStarted = false
  //   this.roundOver = false
  //   this.dealer.set(new User("dealer", [], 10000000))
  // }

  saveUsersStatsToLocalStorage() {

  }
}

import { computed, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Card } from '../models/card.model';
import { Chips } from '../models/chips.model';

@Injectable({
  providedIn: 'root'
})
export class Game {
  deck: Card[] = []
  user = signal<User>(new User("user", [], 3000))
  dealer = signal(new User("dealer", [], 10000000))
  chipsList = signal<Chips[]>([]);
  gameStarted: boolean = false

  // gameOver: boolean = false
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
    // this.user().hand = [
    //   this.deck.find(element => element.name.includes("ace"))!,
    //   this.deck.find(element => element.value == 10)!,
    // ]
  }

  createMoneyChips() {
    const chipsValues: number[] = [1, 5, 10, 25, 50, 100, 500]
    for (let i: number = 0; i < chipsValues.length; i++) {
      this.chipsList().push(new Chips(chipsValues[i], `assets/moneys/${chipsValues[i]}.png`))
    }
  }

  setStartPage() {
    for (let i: number = 0; i < 2; i++) {
      let randomIndex = Math.floor(Math.random() * this.deck.length)
      let selectedCard = this.deck[randomIndex]
      this.user().addCardToHand(selectedCard)
      this.deck.splice(randomIndex, 1)
    }

    this.checkRoundEnd("start", this.user().hand)

    for (let i: number = 0; i < 2; i++) {
      let randomIndex = Math.floor(Math.random() * this.deck.length)
      this.dealer().addCardToHand(this.deck[randomIndex])
      this.deck.splice(randomIndex, 1)
    }

    this.dealer().hand[0].isUpsideDown = true
    this.checkRoundEnd("start", this.user().hand)
  }

  dealersRound() {
    this.dealer().hand[0].isUpsideDown = false
    console.log(this.dealer())
    if (this.dealer().handValue >= 17) {
      this.checkRoundEnd("dealersRound")
      return
    }

    this.dealer().hand[0].isUpsideDown = false
    let randomIndex = Math.floor(Math.random() * this.deck.length)
    this.dealer().addCardToHand(this.deck[randomIndex])
    this.deck.splice(randomIndex, 1)

    while (this.dealer().handValue < 17) {
      randomIndex = Math.floor(Math.random() * this.deck.length)
      this.dealer().addCardToHand(this.deck[randomIndex])
      this.deck.splice(randomIndex, 1)
    }
    this.checkRoundEnd("dealersRound")
  }

  checkRoundEnd(afterEventName: "hit" | "dealersRound" | "start", hand: Card[] = []) {
    //Egyboli gyozelem:
    if (afterEventName == "start" && this.user().handValue == 21) {
      console.log("osztas altal a user nyert")
      this.setResultPage(this.boxValue()*3, "Blackjack")

    } else if (afterEventName == "dealersRound") {
      //dontetlen,
      if (this.user().handValue == this.dealer().handValue) {
        console.log("dontetlen")
        this.setResultPage(this.boxValue(), "Push")
      }
      //Mind a ketten 21 alatt vegeztek
      else if (this.user().handValue < 21 && this.dealer().handValue < 21) {
        //Ha a user van kozelebb
        if ((21 - this.user().handValue) < (21 - this.dealer().handValue)) {
          console.log("a user kozelebb van a 21-hez")
          this.setResultPage(this.boxValue()*2, "Victory")
        }
        //Ha a dealer van kozelebb
        else if ((21 - this.user().handValue) > (21 - this.dealer().handValue)) {
          console.log("a dealer kozelebb van a 21-heze")
          this.setResultPage(0, "Lose")
        }

      }
      // az oszto meghaladja a 21-et
      else if (this.user().handValue <= 21 && this.dealer().handValue > 21) {
        console.log("Az oszto meghaladta a 21et")
        this.setResultPage(this.boxValue()*2, "Dealer bust")
      }

      //A jatekos eri el a 21et
      else if(this.user().handValue == 21){
        console.log("a user nyert")
        this.setResultPage(this.boxValue()*2.5, "Victory")
      }

      //A dealer eri el a 21et
      else if(this.dealer().handValue == 21){
        console.log("a dealer nyert")
        this.setResultPage(0, "Victory")
      }

    } else if (afterEventName == "hit" && this.user().handValue > 21) {
        console.log("a user besokalt")
        this.setResultPage(0, "User's bust")
    }
  }

  checkGameOver() {
    if (this.user().balance <= 0) {
      console.log("elfogyott a penzed!")
    }
  }

  setResultPage(prizeAmount: number, title: string) {
    this.showResultPage = true
    console.log(`a nyert osszeg: ${prizeAmount}`)
    this.user().balance = this.user().balance + prizeAmount
    this.resultObject = {moneyResult: prizeAmount, title: title}
    this.checkGameOver()
  }

  setNewRound(){
    this.boxList.set([])
    this.user.set(
      new User("", [], this.user().balance)
    )
    this.gameStarted = false
    this.roundOver = false
    this.dealer.set(new User("dealer", [], 10000000))
  }
}

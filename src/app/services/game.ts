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

  roundOver: boolean = false
  showResultPage: boolean = false

  boxList = signal<Chips[]>([])
  boxValue = computed(() => {
    let sum = 0;
    this.boxList().forEach(chip => sum += chip.value)
    return sum
  });

  selectedHand = signal<"hand1" | "hand2">("hand1")
  selectedHandList = computed(() => {
    if(this.selectedHand() == "hand1"){
      return this.user().hand
    } else {
      return this.user().secondHand
    }
  })


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
    for (let i: number = 0; i < 2; i++) {
      let randomIndex = Math.floor(Math.random() * this.deck.length)
      let selectedCard = this.deck[randomIndex]
      this.user().addCardToHand(selectedCard)
      this.deck.splice(randomIndex, 1)
    }

    // const sameValues = this.deck.filter(elements => elements.value == 3)
    // this.user().hand = [sameValues[0], sameValues[1]]
    // console.log(this.user())

    this.checkRoundEnd("start", this.user().hand, "hand1")

    for (let i: number = 0; i < 2; i++) {
      let randomIndex = Math.floor(Math.random() * this.deck.length)
      this.dealer().addCardToHand(this.deck[randomIndex])
      this.deck.splice(randomIndex, 1)
    }

    this.dealer().hand[0].isUpsideDown = true
    this.checkRoundEnd("start", this.user().hand, "hand1")
  }

  dealersRound() {
    this.dealer().hand[0].isUpsideDown = false
    console.log(this.dealer())
    if (this.dealer().handValue >= 17) {
      this.checkRoundEnd("dealersRound", this.user().hand, "hand1")
      this.checkRoundEnd("dealersRound", this.user().secondHand, "hand2")
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
    this.checkRoundEnd("dealersRound", this.user().hand, "hand1")
    this.checkRoundEnd("dealersRound", this.user().secondHand, "hand2")
  }

  checkRoundEnd(afterEventName: "hit" | "dealersRound" | "start", hand: Card[], handName: "hand1" | "hand2") {
    let handValue = 0;
    hand.forEach(element => handValue += element.value)

    if(this.user().secondHand.length == 0 && handName == "hand2"){
      return
    }

    //Egyboli gyozelem:
    if (afterEventName == "start" && handValue == 21) {
      console.log("osztas altal a user nyert")
      this.setResultPage(this.boxValue() * 3, "Blackjack", handName)

    } else if (afterEventName == "dealersRound") {
      //dontetlen,
      if (handValue == this.dealer().handValue) {
        console.log("dontetlen")
        this.setResultPage(this.boxValue(), "Push", handName)
      }
      //Mind a ketten 21 alatt vegeztek
      else if (handValue < 21 && this.dealer().handValue < 21) {
        //Ha a user van kozelebb
        if ((21 - handValue) < (21 - this.dealer().handValue)) {
          console.log("a user kozelebb van a 21-hez")
          this.setResultPage(this.boxValue() * 2, "Victory", handName)
        }
        //Ha a dealer van kozelebb
        else if ((21 - handValue) > (21 - this.dealer().handValue)) {
          console.log("a dealer kozelebb van a 21-heze")
          this.setResultPage(0, "Lose", handName)
        }

      }
      // az oszto meghaladja a 21-et
      else if (handValue <= 21 && this.dealer().handValue > 21) {
        console.log("Az oszto meghaladta a 21et")
        this.setResultPage(this.boxValue() * 2, "Dealer bust", handName)
      }

      //A jatekos eri el a 21et
      else if (handValue == 21) {
        console.log("a user nyert")
        this.setResultPage(this.boxValue() * 2.5, "Victory", handName)
      }

      //A dealer eri el a 21et
      else if (this.dealer().handValue == 21) {
        console.log("a dealer nyert")
        this.setResultPage(0, "Victory", handName)
      }

    } else if (afterEventName == "hit" && handValue > 21) {
      console.log("a user besokalt")
      this.setResultPage(0, "User's bust", handName)
    }
  }

  checkGameOver() {
    if (this.user().balance <= 0) {
      console.log("elfogyott a penzed!")
    }
  }

  setResultPage(prizeAmount: number, title: string, handName: string) {
    // this.showResultPage = true
    console.log(`a nyert osszeg: ${prizeAmount} a ${handName}-vel`)
    // this.user().balance = this.user().balance + prizeAmount
    // this.resultObject = { moneyResult: prizeAmount, title: title }
    // this.checkGameOver()
    // this.saveUsersStatsToLocalStorage()
  }

  setNewRound() {
    this.boxList.set([])
    this.user.set(
      new User("", [], this.user().balance)
    )
    this.gameStarted = false
    this.roundOver = false
    this.dealer.set(new User("dealer", [], 10000000))
  }

  saveUsersStatsToLocalStorage() {

  }
}

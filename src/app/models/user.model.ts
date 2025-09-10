import { Card } from "./card.model";

export class User {
  constructor(
    private _username: string,
    private _hand: Card[],
    private _balance: number,
    private _handValue: number = 0,
    private _secondHandValue: number = 0,
    private _secondHand: Card[] = [],
  ) { }

  //Getterek:
  get username(): string {
    return this._username;
  }

  get hand(): Card[] {
    return this._hand;
  }

  get balance(): number {
    return this._balance;
  }

  get secondHand(): Card[] {
    return this._secondHand;
  }

  get handValue(): number {
    return this._handValue
  }

  get secondHandValue(): number {
    return this._secondHandValue
  }

  //Setterek:
  set username(newUsername: string) {
    this._username = newUsername;
  }

  set hand(newHand: Card[]) {
    this._hand = newHand;
  }

  set balance(newBalance: number) {
    this._balance = newBalance;
  }

  set secondHand(newSecondHand: Card[]) {
    this._secondHand = newSecondHand;
  }

  set handValue(newValue: number) {
    this._handValue = newValue
  }

  set secondHandValue(newValue: number) {
    this._secondHandValue = newValue
  }

  //Egyeb:
  addCardToHand(addedCard: Card, wantedHand: "hand1" | "hand2" = "hand1"): void {
    if (wantedHand == "hand1") {
      this._hand.push(addedCard)
      this._handValue += addedCard.value

    } else if (wantedHand == "hand2") {
      this._secondHand.push(addedCard)
      this._secondHandValue += addedCard.value
    }
  }

  getWantedHandValue(wantedHand: "hand1" | "hand2"): number{
    if (wantedHand == "hand1"){
      return this._handValue
    } else {
      return this._secondHandValue
    }
  }
}

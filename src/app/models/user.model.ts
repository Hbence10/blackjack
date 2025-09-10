import { Card } from "./card.model";

export class User {
  constructor(
    private _username: string,
    private _hand: Card[],
    private _balance: number,
    private _secondHand: Card[] = [],
    private _handValue: number = 0
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

  set handValue(newValue: number){
    this._handValue = newValue
  }

  //Egyeb:
  addCardToHand(addedCard: Card): void {
    this._hand.push(addedCard)
    this.handValue = this.handValue + addedCard.value
  }
}

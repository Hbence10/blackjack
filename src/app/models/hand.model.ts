import { Card } from "./card.model";

export class Hand{
  constructor(
    private _cardList: Card[],
    private _value: number,
    private _bet: number,
    private _isStanded: boolean = false,
    private _isDoubled: boolean = false
  ){}

  //Getterek:
  get cardList(): Card[] {
    return this._cardList
  }

  get value(): number {
    return this._value
  }

  get bet(): number {
    return this._bet
  }

  //ha standelt a user akkor nem tud hitelni
  get isStanded(): boolean {
    return this._isStanded
  }

  get isDoubled(): boolean {
    return this._isDoubled
  }

  //Setterek:
  set cardList(newList: Card[]){
    this._cardList = newList
  }

  set value(newValue: number){
    this._value = newValue
  }

  set bet(newBet: number){
    this._bet = newBet
  }

  set isStanded(newValue: boolean){
    this._isStanded = newValue
  }

  set isDoubled(newValue: boolean){
    this._isDoubled = newValue
  }

  //Egyeb
  addCard(newCard: Card){
    this._cardList.push(newCard)
    this._value += newCard.value
  }

  //Ha splitelni szeretne a user
  removeCard(){
    this._value = (this._value - this.cardList[1].value)
    this._cardList.pop()
  }
}

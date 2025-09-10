import { Hand } from "./hand.model";

export class User {
  constructor(
    private _username: string,
    private _balance: number,
    private _handList: Hand[] = [],
    private _actualHandIndex: number = 0
  ) { }

  //Getterek:
  get username(): string {
    return this._username;
  }

  get balance(): number {
    return this._balance;
  }

  get handList(): Hand[] {
    return this._handList
  }

  get actualHandIndex(): number {
    return this._actualHandIndex
  }

  //Setterek:
  set username(newUsername: string) {
    this._username = newUsername;
  }

  set balance(newBalance: number) {
    this._balance = newBalance;
  }

  set handList(newHandList: Hand[]){
    this._handList = newHandList
  }

  set actualHandIndex(newIndex: number){
    this._actualHandIndex = newIndex
  }

  //Egyeb:
  addHand(newHand: Hand){
    this._handList.push(newHand)
  }
}

export class ResultDetails {
  constructor(
    private _title: string,
    private _prizeAmount: number,
    private _handIndex: number
  ) { }

  get title(): string {
    return this._title
  }

  get prizeAmount(): number {
    return this._prizeAmount
  }

  get handIndex():number{
    return this._handIndex
  }

  set title(newTitle: string){
    this._title = newTitle
  }

  set prizeAmount(newAmount: number){
    this._prizeAmount = newAmount
  }
}

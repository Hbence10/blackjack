export class Chips{
  constructor(
    private _value: number,
    private _imgPath: string
  ){}

  //Getterek:
  get value(): number {
    return this._value
  }

  get imgPath(): string {
    return this._imgPath
  }

  //Setterek:
  set value(newValue: number){
    this._value = newValue
  }

  set imgPath(newImgPath: string){
    this._imgPath = newImgPath
  }
}

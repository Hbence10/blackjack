export class Card {
  constructor(
    private _name: string,
    private _value: number,
    private _sign: string,
    private _faceImgPath: string = "",
    private _backImgPath: string = "assets/cardBg.png",
    private _isUpsideDown: boolean = false
  ) { }

  //Getterek:
  get name(): string {
    return this._name
  }

  get value(): number {
    return this._value
  }

  get sign(): string {
    return this._sign
  }

  get backImgPath(): string {
    return this._backImgPath
  }

  get faceImgPath(): string {
    return this._faceImgPath
  }

  get isUpsideDown(): boolean {
    return this._isUpsideDown
  }

  //Setterek:
  set name(newName: string) {
    this._name = newName
  }

  set value(newValue: number) {
    this._value = newValue
  }

  set sign(newSign: string) {
    this._sign = newSign
  }

  set backImgPath(newbackImgPath: string) {
    this._backImgPath = newbackImgPath
  }

  set faceImgPath(newFaceImgPath: string) {
    this._faceImgPath = newFaceImgPath
  }

  set isUpsideDown(newUpsideDown: boolean) {
    this._isUpsideDown = newUpsideDown
  }
}

export class BuffAble<Value> {
  public value: Value

  constructor(public readonly initialValue: Value) {
    this.value = initialValue
  }

  reset() {
    this.value = this.initialValue
  }
}

export class BuffAbleNumber extends BuffAble<number> {
  get ratio() {
    return this.value / this.initialValue
  }
}

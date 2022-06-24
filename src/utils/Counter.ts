export class Counter {
  private current: number;
  constructor(value = 0) {
    this.current = value;
  }

  get value() {
    return this.current;
  }

  incrementGet(): number {
    this.current += 1;
    return this.current;
  }

  decrementGet(): number {
    this.current -= 1;
    return this.current;
  }
}

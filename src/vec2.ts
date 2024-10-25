/* eslint-disable @typescript-eslint/adjacent-overload-signatures */

export default class Vec2 {
  elems: Array<number> = [0, 0];
  
  get x() { return this.elems[0]; }
  get y() { return this.elems[1]; }
  set x(value) { this.elems[0] = value; }
  set y(value) { this.elems[1] = value; }


  // Constructors

  public static vec2(x: number, y: number): Vec2 {
    const result = new Vec2();
    result.x = x;
    result.y = y;
    return result;
  }


  // Memory

  public clone(): Vec2 {
    return Vec2.vec2(this.x, this.y);
  }


  // Arithmetic

  public static add(a: Vec2, b: Vec2 | number): Vec2 {
    if (typeof(b) === 'number')
      return Vec2.vec2(a.x + b, a.y + b);
    return Vec2.vec2(a.x + b.x, a.y + b.y);
  }
  public static sub(a: Vec2, b: Vec2 | number): Vec2 {
    if (typeof(b) === 'number')
      return Vec2.vec2(a.x - b, a.y - b);
    return Vec2.vec2(a.x - b.x, a.y - b.y);
  }
  public static mult(a: Vec2, b: Vec2 | number): Vec2 {
    if (typeof(b) === 'number')
      return Vec2.vec2(a.x * b, a.y * b);
    return Vec2.vec2(a.x * b.x, a.y * b.y);
  }
  public static div(a: Vec2, b: Vec2 | number): Vec2 {
    if (typeof(b) === 'number')
      return Vec2.vec2(a.x / b, a.y / b);
    return Vec2.vec2(a.x / b.x, a.y / b.y);
  }

  public static equals(a: Vec2, b: Vec2): boolean {
    return a.x === b.x && a.y === b.y;
  }


  // Misc operations

  public static min(a: Vec2, b: Vec2): Vec2 {
    return Vec2.vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
  }
  public static max(a: Vec2, b: Vec2): Vec2 {
    return Vec2.vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
  }

  public square_length(): number {
    return this.x*this.x + this.y*this.y;
  }
  public length(): number {
    return Math.sqrt(this.square_length());
  }
}
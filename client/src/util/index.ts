export function prettyDecimal(value: number): string {
  return value.toFixed(10).replace(new RegExp('[0]+$'), '').replace(new RegExp('[.]+$'), '')
}

export function literal<T>(o: T): T {
  return o
}

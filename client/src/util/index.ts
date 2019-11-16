export function prettyDecimal(value: number) {
  return value
    .toFixed(10)
    .replace(new RegExp('[0]+$'), '')
    .replace(new RegExp('[.]+$'), '')
}

export function literal<T>(o: T): T {
  return o
}

declare module 'shallow-equal' {
  export function shallowEqualArrays(a: any[], b: any[]): boolean

  export function shallowEqualObjects(a: { [key: any]: any }, b: { [key: any]: any }): boolean
}

export interface CommandEnumOption {
  id: number
  name: string
}

export enum CommandPropertyType {
  Int = 'Int',
  Double = 'Double',
  Bool = 'Bool',
  Enum = 'Enum',
  Flags = 'Flags',
  String = 'String',
  ByteArray = 'ByteArray',
  IntArray = 'IntArray',
  Timestamp = 'Timestamp',
  IpAddress = 'IpAddress',
}

export interface CommandProperty {
  name: string
  isId: boolean

  type: CommandPropertyType

  min?: number
  max?: number
  scale?: number

  options?: CommandEnumOption[]
}

export interface CommandSpec {
  fullName: string
  name: string

  toServer: boolean
  toClient: boolean

  isValid: boolean
  initialVersion?: number // TODO - type?

  properties: CommandProperty[]
}

export interface CommandSpecSet {
  commands: { [fullName: string]: CommandSpec }
}

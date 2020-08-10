import React from 'react'

export class StickyPanelBase<TP, TS, TSS = {}> extends React.Component<TP, TS, TSS> {
  private readonly stickyProps: Array<keyof TS> = []
  private readonly baseSessionStorageKey: string

  constructor(props: TP, baseSessionStorageKey: string) {
    super(props)
    this.baseSessionStorageKey = baseSessionStorageKey

    this.syncSessionValues = this.syncSessionValues.bind(this)
  }

  protected trackSessionValues(...keys: Array<keyof TS>): void {
    this.stickyProps.push(...keys)
  }

  protected getSessionValue(key: keyof TS): number | null {
    const fullKey = `${this.baseSessionStorageKey}.${key}`
    const rawVal = window.sessionStorage.getItem(fullKey)
    if (rawVal === null) return rawVal
    return Number(rawVal) || 0
  }

  protected syncSessionValues(): void {
    for (const key of this.stickyProps) {
      const fullKey = `${this.baseSessionStorageKey}.${key}`
      let val: any = this.state[key]
      if (val === false) val = 0
      if (val === true) val = 1
      window.sessionStorage.setItem(fullKey, val)
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.syncSessionValues)
  }

  componentWillUnmount() {
    this.syncSessionValues()
    window.removeEventListener('beforeunload', this.syncSessionValues)
  }
}

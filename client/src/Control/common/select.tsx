import React from 'react'

interface SelectInputProps<T extends string | number> {
  label: string
  value: T
  options: Array<{ id: T; label: string }>
  onChange: (val: T) => void
  disabled?: boolean
}
export function SelectInput<T extends string | number>(props: SelectInputProps<T>) {
  return (
    <div className="ss-row">
      <div className={props.disabled ? 'ss-label disabled' : 'ss-label'}>{props.label}:</div>
      <select
        disabled={props.disabled}
        onChange={e =>
          props.onChange(
            typeof props.value === 'string'
              ? ((e.currentTarget.value as unknown) as T)
              : (Number(e.currentTarget.value) as T)
          )
        }
        value={props.value}
        className="atem-dropdown"
      >
        {props.options.map((opt, i) => (
          <option key={i} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function SelectInput2<T extends string | number>(props: SelectInputProps<T>) {
  return (
    <>
      <div className={props.disabled ? 'atem-label disabled' : 'atem-label'}>{props.label}:</div>
      <select
        disabled={props.disabled}
        onChange={e =>
          props.onChange(
            typeof props.value === 'string'
              ? ((e.currentTarget.value as unknown) as T)
              : (Number(e.currentTarget.value) as T)
          )
        }
        value={props.value}
        className="atem-dropdown"
      >
        {props.options.map((opt, i) => (
          <option key={i} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </>
  )
}

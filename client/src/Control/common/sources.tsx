import React from 'react'
import { LibAtemState, LibAtemEnums } from '../../generated'

function getSourceOptions(
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>,
  sourceAvailability: LibAtemEnums.SourceAvailability,
  meAvailability: LibAtemEnums.MeAvailability = LibAtemEnums.MeAvailability.None
) {
  return Array.from(sources.entries())
    .filter(
      ([i, v]) =>
        (sourceAvailability === LibAtemEnums.SourceAvailability.None ||
          (v.sourceAvailability & sourceAvailability) === sourceAvailability) &&
        (meAvailability === LibAtemEnums.MeAvailability.None || (v.meAvailability & meAvailability) === meAvailability)
    )
    .sort((a, b) => a[0] - b[0])
    .map(([i, v]) => (
      <option key={i} value={i}>
        {v.longName}
      </option>
    ))
}

interface SourceSelectInputProps {
  disabled?: boolean
  label: string
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  sourceAvailability: LibAtemEnums.SourceAvailability
  meAvailability?: LibAtemEnums.MeAvailability
  value: LibAtemEnums.VideoSource
  onChange: (val: LibAtemEnums.VideoSource) => void
}
export function SourceSelectInput(props: SourceSelectInputProps) {
  return (
    <div className="ss-row">
      <div className={`ss-label ${props.disabled ? 'disabled' : ''}`}>{props.label}:</div>
      <select
        disabled={props.disabled}
        onChange={e => props.onChange(Number(e.currentTarget.value))}
        value={props.value}
        className="ss-dropdown"
      >
        {getSourceOptions(
          props.sources,
          props.sourceAvailability,
          props.meAvailability ?? LibAtemEnums.MeAvailability.None
        )}
      </select>
    </div>
  )
}

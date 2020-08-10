import React from 'react'
import { LibAtemState, LibAtemEnums } from '../generated'

export type SourcesMap = ReadonlyMap<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>

export function isSourceAvailable(
  src: LibAtemState.InputState_PropertiesState,
  sourceAvailability: LibAtemEnums.SourceAvailability,
  meAvailability: number | null
): boolean {
  return (
    (sourceAvailability === LibAtemEnums.SourceAvailability.None ||
      (src.sourceAvailability & sourceAvailability) === sourceAvailability) &&
    (meAvailability === null || (src.meAvailability & (1 << meAvailability)) === 1 << meAvailability)
  )
}
function getSourceOptions(
  sources: SourcesMap,
  sourceAvailability: LibAtemEnums.SourceAvailability,
  meAvailability: number | null
) {
  return Array.from(sources.entries())
    .filter(([i, v]) => isSourceAvailable(v, sourceAvailability, meAvailability))
    .sort((a, b) => a[0] - b[0])
    .map(([i, v]) => (
      <option key={i} value={i}>
        {v.longName}
      </option>
    ))
}

interface SourceSelectInputProps {
  disabled?: boolean
  label: string | null
  sources: SourcesMap
  sourceAvailability: LibAtemEnums.SourceAvailability
  meAvailability?: number | null
  value: LibAtemEnums.VideoSource
  onChange: (val: LibAtemEnums.VideoSource) => void
}
export function SourceSelectInput(props: SourceSelectInputProps) {
  return (
    <>
      {props.label !== null ? (
        <div className={`atem-label ${props.disabled ? 'disabled' : ''}`}>{props.label}:</div>
      ) : (
        ''
      )}
      <select
        disabled={props.disabled}
        onChange={(e) => props.onChange(Number(e.currentTarget.value))}
        value={props.value}
        className="atem-dropdown"
      >
        {getSourceOptions(props.sources, props.sourceAvailability, props.meAvailability ?? null)}
      </select>
    </>
  )
}

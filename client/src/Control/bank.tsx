import { AtemButtonGeneric, SourcesMap, isSourceAvailable } from '../components'
import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { SendCommandStrict } from '../device-page-wrapper'
import { LibAtemState, LibAtemEnums } from '../generated'
import * as _ from 'underscore'

interface BankPanelProps {
  sendCommand: SendCommandStrict
  meIndex: number
  inTransition: boolean
  isProgram: boolean
  currentSource: number
  sources: SourcesMap
}

function createButton(
  props: BankPanelProps,
  id: LibAtemEnums.VideoSource,
  info: LibAtemState.InputState_PropertiesState
) {
  const buttonColor = props.isProgram || props.inTransition ? 'red' : 'green'
  return (
    <AtemButtonGeneric
      key={id}
      color={buttonColor}
      name={info.shortName}
      callback={() => {
        if (props.isProgram) {
          props.sendCommand('LibAtem.Commands.MixEffects.ProgramInputSetCommand', {
            Index: props.meIndex,
            Source: id,
          })
        } else {
          props.sendCommand('LibAtem.Commands.MixEffects.PreviewInputSetCommand', {
            Index: props.meIndex,
            Source: id,
          })
        }
      }}
      active={props.currentSource === id}
    />
  )
}

export function BankPanel(props: BankPanelProps) {
  const title = props.isProgram ? 'Program' : 'Preview'

  const availableSources = Array.from(props.sources.entries()).filter(([i, v]) =>
    isSourceAvailable(v, LibAtemEnums.SourceAvailability.None, props.meIndex)
  )

  const groupedSources = _.groupBy(availableSources, ([i, src]) => src.internalPortType)
  const createOfType = (type: LibAtemEnums.InternalPortType) => {
    return (groupedSources[type] ?? []).map(([i, src]) => createButton(props, i, src))
  }

  const inputButtons = createOfType(LibAtemEnums.InternalPortType.External)
  const colorButtons = createOfType(LibAtemEnums.InternalPortType.ColorGenerator)
  const barsButtons = createOfType(LibAtemEnums.InternalPortType.ColorBars)
  const ssrcButtons = createOfType(LibAtemEnums.InternalPortType.SuperSource)
  const blackButtons = createOfType(LibAtemEnums.InternalPortType.Black)
  const mediaPlayerButtons = createOfType(LibAtemEnums.InternalPortType.MediaPlayerFill)
  const meButtons = createOfType(LibAtemEnums.InternalPortType.MEOutput)

  const isPhone = useMediaQuery({ query: '(min-width: 600px)' })

  if (!isPhone) {
    return (
      <div className="box pp" id={title}>
        <div className="box-title">{title}</div>
        <div className="box-inner mobile">
          <div className="bank-button-grid">{inputButtons}</div>
          <div className="bank-button-grid">
            {blackButtons}
            {ssrcButtons}
            {barsButtons}
            {colorButtons}
            {mediaPlayerButtons}
            {meButtons}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="box pp" id={title}>
        <div className="box-title">{title}</div>
        <div className="box-inner desktop">
          <div className="bank-button-grid">{inputButtons}</div>
          <div className="bank-button-grid">
            {blackButtons}
            {ssrcButtons}
            {barsButtons}
          </div>
          <div className="bank-button-grid">
            {colorButtons}
            {mediaPlayerButtons.length <= 1 ? <div></div> : ''}
            {mediaPlayerButtons}
            {meButtons}
          </div>
        </div>
      </div>
    )
  }
}

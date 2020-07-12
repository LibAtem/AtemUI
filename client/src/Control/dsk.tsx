import { AtemButtonGeneric } from './button/button'
import { RateInput } from './Settings/settings'
import React from 'react'
import { SendCommandStrict } from '../device-page-wrapper'
import * as LibAtem  from '../libatem'

interface DSKProps {
  sendCommand: SendCommandStrict
  downstreamKeyers: LibAtem.DownstreamKeyerState[]
  videoMode: LibAtem.VideoMode
}

export function DSKPanel(props: DSKProps) {
  const headings: React.ReactElement[] = []
  const dsks = props.downstreamKeyers.map((dsk, index) => {
    headings.push(<div key={index}>DSK{index + 1}</div>)

    return (
      <div key={index} className="dsk-col">
        <AtemButtonGeneric
          color="yellow"
          name={'Tie'}
          callback={() =>
            props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyTieSetCommand', {
              Index: index,
              Tie: !dsk.properties.tie
            })
          }
          active={dsk.properties.tie}
        />
        <div className="rate">
          {' '}
          Rate
          <RateInput
            className={'rate-input'}
            callback={(e) => {
              props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyRateSetCommand', { Index: index, Rate: e })
            }}
            value={dsk.state.remainingFrames}
            videoMode={props.videoMode}
          />
        </div>
        <AtemButtonGeneric
          color="red"
          textClassName={'on-air'}
          name={'ON AIR'}
          callback={() =>
            props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyOnAirSetCommand', {
              Index: index,
              OnAir: !dsk.state.onAir
            })
          }
          active={dsk.state.onAir}
        />
        <AtemButtonGeneric
          color="red"
          name={'AUTO'}
          callback={() =>
            props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyAutoV8Command', {
              Index: index,
              IsTowardsOnAir: !dsk.state.isTowardsOnAir
            })
          }
          active={dsk.state.isAuto}
        />
      </div>
    )
  })

  return (
    <div className="box" id="DSK">
      <div className="box-title dsk-title" style={{ gridTemplateColumns: `repeat(${headings.length}, 1fr)` }}>
        {headings}
      </div>

      <div className="box-dsk" style={{ gridTemplateColumns: `repeat(${dsks.length}, 50px)` }}>
        {dsks}
      </div>
    </div>
  )
}

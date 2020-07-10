import { AtemButtonGeneric } from './button/button'
import React from 'react'
import { SendCommand } from '.'
import { useMediaQuery } from 'react-responsive'

export interface InputProps {
  index: number
  name: string
  type: unknown
}

interface BankProps {
  sendCommand: SendCommand
  meIndex: number
  inTransition: boolean
  isProgram: boolean
  currentSource: number
  sources: InputProps[]
}

export function BankPanel(props: BankProps) {
  const buttonColor = props.isProgram || props.inTransition ? 'red' : 'green'
  const command = props.isProgram
    ? 'LibAtem.Commands.MixEffects.ProgramInputSetCommand'
    : 'LibAtem.Commands.MixEffects.PreviewInputSetCommand'
  const title = props.isProgram ? 'Program' : 'Preview'

  const createButton = (info: InputProps) => (
    <AtemButtonGeneric
      key={info.index}
      color={buttonColor}
      name={info.name}
      callback={() => props.sendCommand(command, { Index: props.meIndex, Source: info.index })}
      active={props.currentSource === info.index}
    />
  )

  const tryCreateButton = (index: number) => {
    const info = props.sources.find(src => src.index === index)
    if (info) {
      return createButton(info)
    } else {
      return <div key={index}></div>
    }
  }

  const inputButtons = props.sources.filter(src => src.index < 50 && src.index > 0).map(createButton)

  const blk = tryCreateButton(0)
  const bars = tryCreateButton(1000)
  const col1 = tryCreateButton(2001)
  const mp1 = tryCreateButton(3010)
  const mp2 = tryCreateButton(3020)

  const isPhone = useMediaQuery({ query: '(min-width: 600px)' })

  if (!isPhone) {
    return (
      <div className="box pp" id={title}>
        <div className="box-title">{title}</div>
        <div className="box-inner-mobile">
          <div className="box-inner-inputs">{inputButtons}</div>
          <div className="box-program-row">
            {blk}
            {bars}
            {col1}
            {mp1}
            {mp2}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="box pp" id={title}>
        <div className="box-title">{title}</div>
        <div className="box-inner">
          <div className="box-inner-inputs">{inputButtons}</div>
          <div className="box-inner-mid">
            {blk}
            {bars}
          </div>
          <div className="box-inner-rest">
            {col1}
            <div></div>
            {mp1}
            {mp2}
          </div>
        </div>
      </div>
    )
  }
}

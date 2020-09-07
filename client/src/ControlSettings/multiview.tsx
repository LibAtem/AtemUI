import { Container, Button } from 'react-bootstrap'
import React from 'react'
import { StickyPanelBase } from '../Control/Settings/base'
import { SendCommandStrict } from '../device-page-wrapper'
import { LibAtemState, LibAtemEnums, LibAtemCommands } from '../generated'
import { SourcesMap, SourceSelectInput, AtemButtonBar } from '../components'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LayoutIcon } from './multiviewLayout'

interface MultiViewSettingsProps {
  sendCommand: SendCommandStrict
  sources: SourcesMap
  info: LibAtemState.InfoState_MultiViewInfoState | undefined
  multiViewers: LibAtemState.MultiViewerState[]
}
interface MultiViewSettingsState {
  page: number
}

export class MultiViewSettings extends StickyPanelBase<MultiViewSettingsProps, MultiViewSettingsState> {
  constructor(props: MultiViewSettingsProps) {
    super(props, 'settings.multiview')

    this.trackSessionValues('page')

    this.state = {
      page: this.getSessionValue('page') ?? 0,
    }
  }

  //   private renderQuadrant(mv: LibAtemState.MultiViewerState_PropertiesState, mask: LibAtemEnums.MultiViewLayoutV8) {
  //     if ((mv.layout & mask) === mask) {
  //         // Means small
  //         return <div className="mutliViewItem programPreview">GRID HERE</div>
  //     } else {
  //         return <div className="mutliViewItem programPreview">Preview</div>
  //     }
  //   }

  private renderLegacyLargeWindow(mv: LibAtemState.MultiViewerState, index: number) {
    const window = mv.windows[index]
    const name = this.props.sources.get(window.source)?.longName ?? ''

    return (
      <div className="mutliViewItem programPreview">
        <div className="name-row">{name}</div>
        {this.renderBoxButton(mv, index)}
      </div>
    )
  }

  private renderSmallGrid(
    info: LibAtemState.InfoState_MultiViewInfoState,
    mv: LibAtemState.MultiViewerState,
    boxIds: [number, number, number, number]
  ) {
    const mvIndex = this.state.page
    return <div className="multiViewSubGrid">{boxIds.map((i) => this.renderWindowBox(info, mv, i))}</div>
  }

  private renderWindowBox(
    info: LibAtemState.InfoState_MultiViewInfoState,
    mv: LibAtemState.MultiViewerState,
    boxId: number
  ) {
    const win = mv.windows[boxId]
    return (
      <div key={boxId} className="mutliViewItem">
        <div>
          {info.canRouteInputs ? (
            <SourceSelectInput
              label={null}
              sources={this.props.sources}
              sourceAvailability={LibAtemEnums.SourceAvailability.Multiviewer}
              value={win.source}
              onChange={(v) => {
                this.props.sendCommand('LibAtem.Commands.Settings.Multiview.MultiviewWindowInputSetCommand', {
                  MultiviewIndex: this.state.page,
                  WindowIndex: boxId,
                  Source: v,
                })
              }}
            />
          ) : (
            this.props.sources.get(win.source)?.longName ?? ''
          )}
        </div>
        {this.renderBoxButton(mv, boxId)}
      </div>
    )
  }

  private renderBoxButton(mv: LibAtemState.MultiViewerState, box: number) {
    const boxProps = mv.windows[box]

    return (
      <div className="button-row">
        {boxProps?.supportsSafeArea ? (
          <Button
            bsPrefix="multiViewButton"
            variant={boxProps.safeAreaEnabled ? 'primary' : 'secondary'}
            onClick={() => {
              this.props.sendCommand('LibAtem.Commands.Settings.Multiview.MultiviewWindowSafeAreaCommand', {
                MultiviewIndex: this.state.page,
                WindowIndex: box,
                SafeAreaEnabled: !boxProps.safeAreaEnabled,
              })
            }}
          >
            <SafeAreaIcon isCurrent={boxProps.safeAreaEnabled} />
          </Button>
        ) : (
          ''
        )}
        {boxProps?.supportsVuMeter ? (
          <Button
            bsPrefix="multiViewButton"
            variant={boxProps.vuMeterEnabled ? 'primary' : 'secondary'}
            onClick={() => {
              this.props.sendCommand('LibAtem.Commands.Settings.Multiview.MultiviewWindowVuMeterSetCommand', {
                MultiviewIndex: this.state.page,
                WindowIndex: box,
                VuEnabled: !boxProps.vuMeterEnabled,
              })
            }}
          >
            <VuMeterIcon isCurrent={boxProps.vuMeterEnabled} />
          </Button>
        ) : (
          ''
        )}
      </div>
    )
  }

  private renderSwapButton(mv: LibAtemState.MultiViewerState) {
    return (
      <div className="swap-preview-program">
        <Button
          bsPrefix="multiViewButton"
          variant="secondary"
          onClick={() => {
            this.props.sendCommand('LibAtem.Commands.Settings.Multiview.MultiviewPropertiesSetV8Command', {
              MultiviewIndex: this.state.page,
              Mask: LibAtemCommands.Settings_Multiview_MultiviewPropertiesSetV8Command_MaskFlags.ProgramPreviewSwapped,
              ProgramPreviewSwapped: !mv.properties.programPreviewSwapped,
            })
          }}
        >
          <FontAwesomeIcon icon={faSyncAlt} />
        </Button>
      </div>
    )
  }

  private renderContent(info: LibAtemState.InfoState_MultiViewInfoState, mv: LibAtemState.MultiViewerState) {
    var layout = [] as Array<[number, number, number, number] | number>

    const current = mv.properties.layout
    if (info.supportsQuadrantLayout) {
      layout = [
        (current & LibAtemEnums.MultiViewLayoutV8.TopLeftSmall) > 0 ? [0, 1, 4, 6] : 0,
        (current & LibAtemEnums.MultiViewLayoutV8.TopRightSmall) > 0 ? [2, 3, 6, 7] : 2,
        (current & LibAtemEnums.MultiViewLayoutV8.BottomLeftSmall) > 0 ? [8, 9, 12, 13] : 8,
        (current & LibAtemEnums.MultiViewLayoutV8.BottomRightSmall) > 0 ? [10, 11, 14, 15] : 10,
      ]
    } else {
      switch (current) {
        case LibAtemEnums.MultiViewLayoutV8.ProgramTop:
          layout = [0, 1, [2, 3, 6, 7], [4, 5, 8, 9]]
          break
        case LibAtemEnums.MultiViewLayoutV8.ProgramBottom:
          layout = [[2, 3, 6, 7], [4, 5, 8, 9], 0, 1]
          break
        case LibAtemEnums.MultiViewLayoutV8.ProgramLeft:
          layout = [0, [2, 3, 4, 5], 1, [6, 7, 8, 9]]
          break
        case LibAtemEnums.MultiViewLayoutV8.ProgramRight:
          layout = [[2, 3, 4, 5], 0, [6, 7, 8, 9], 1]
          break
      }
    }

    const content = layout.map((inf) => {
      if (typeof inf === 'number') {
        if (info.supportsQuadrantLayout) {
          return this.renderWindowBox(info, mv, inf)
        } else {
          return this.renderLegacyLargeWindow(mv, inf)
        }
      } else {
        return this.renderSmallGrid(info, mv, inf)
      }
    })

    if (info.supportsProgramPreviewSwapped) {
      content.push(this.renderSwapButton(mv))
    }

    return content
  }

  private renderChangeLayout(
    info: LibAtemState.InfoState_MultiViewInfoState,
    mv: LibAtemState.MultiViewerState_PropertiesState
  ) {
    if (info.supportsQuadrantLayout) {
      return <div className="layout-bar">TODO</div>
    } else {
      return (
        <div className="layout-bar">
          <LayoutButton
            sendCommand={this.props.sendCommand}
            mvIndex={this.state.page}
            current={mv.layout}
            target={LibAtemEnums.MultiViewLayoutV8.ProgramTop}
          />
          <LayoutButton
            sendCommand={this.props.sendCommand}
            mvIndex={this.state.page}
            current={mv.layout}
            target={LibAtemEnums.MultiViewLayoutV8.ProgramBottom}
          />
          <LayoutButton
            sendCommand={this.props.sendCommand}
            mvIndex={this.state.page}
            current={mv.layout}
            target={LibAtemEnums.MultiViewLayoutV8.ProgramLeft}
          />
          <LayoutButton
            sendCommand={this.props.sendCommand}
            mvIndex={this.state.page}
            current={mv.layout}
            target={LibAtemEnums.MultiViewLayoutV8.ProgramRight}
          />
        </div>
      )
    }
  }

  private renderVuControls(mv: LibAtemState.MultiViewerState_PropertiesState) {
    return ''
  }

  render() {
    const mvIndex = this.state.page
    const mv = this.props.multiViewers[mvIndex]
    const info = this.props.info

    if (!mv || !info) {
      return <div>Missing state</div>
    }

    return (
      <Container className="maxW" style={{ paddingTop: '1rem' }}>
        {this.props.multiViewers.length > 1 || this.state.page !== 0 ? (
          <AtemButtonBar
            selected={this.state.page}
            options={this.props.multiViewers.map((mv, i) => ({
              value: i,
              label: `Multi View ${i + 1}`,
            }))}
            onChange={(newPage) => this.setState({ page: newPage })}
          />
        ) : (
          ''
        )}

        <div className="multiViewProperties">
          {info.canChangeLayout ? (
            <div className="layout">
              <div className="atem-heading">View Layout</div>
              {this.renderChangeLayout(info, mv.properties)}
            </div>
          ) : (
            ''
          )}
          {info.supportsVuMeters ? (
            <div className="vu-meters">
              <div className="atem-heading">Audio Meters</div>
              {this.renderVuControls(mv.properties)}
            </div>
          ) : (
            ''
          )}
        </div>

        <div className="multiViewGrid">{this.renderContent(info, mv)}</div>
      </Container>
    )
  }
}

class LayoutButton extends React.Component<
  {
    sendCommand: SendCommandStrict
    mvIndex: number
    current: LibAtemEnums.MultiViewLayoutV8
    target: LibAtemEnums.MultiViewLayoutV8
  },
  { hover: boolean }
> {
  constructor(props: LayoutButton['props']) {
    super(props)

    this.state = {
      hover: false,
    }

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  onMouseEnter() {
    this.setState({ hover: true })
  }
  onMouseLeave() {
    this.setState({ hover: false })
  }

  render() {
    const { current, target, mvIndex } = this.props
    return (
      <Button
        className="multiViewLayoutButton"
        bsPrefix="multiViewLayoutButton"
        variant={current === target ? 'primary' : 'secondary'}
        onClick={() =>
          this.props.sendCommand('LibAtem.Commands.Settings.Multiview.MultiviewPropertiesSetV8Command', {
            MultiviewIndex: mvIndex,
            Mask: LibAtemCommands.Settings_Multiview_MultiviewPropertiesSetV8Command_MaskFlags.Layout,
            Layout: target,
          })
        }
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <LayoutIcon layout={target} isCurrent={current === target} isHover={this.state.hover} />
      </Button>
    )
  }
}

class VuMeterIcon extends React.PureComponent<{ isCurrent: boolean }> {
  render() {
    const { isCurrent } = this.props
    const colB = isCurrent ? '#ffffff' : '#848484'
    const colM = isCurrent ? '#acacac' : '#7d7d7d'
    const colT = isCurrent ? '#717171' : '#6e6e6e'
    return (
      <svg width="22px" height="22px" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect id="l5" x="5" y="2" width="5" height="2" fill={colT} />
          <rect id="r5" x="12" y="2" width="5" height="2" fill={colT} />
          <rect id="l4" x="5" y="6" width="5" height="2" fill={colT} />
          <rect id="r4" x="12" y="6" width="5" height="2" fill={colT} />

          <rect id="l3" x="5" y="10" width="5" height="2" fill={colM} />
          <rect id="r3" x="12" y="10" width="5" height="2" fill={colM} />

          <rect id="l2" x="5" y="14" width="5" height="2" fill={colB} />
          <rect id="r2" x="12" y="14" width="5" height="2" fill={colB} />
          <rect id="l1" x="5" y="18" width="5" height="2" fill={colB} />
          <rect id="r1" x="12" y="18" width="5" height="2" fill={colB} />
        </g>
      </svg>
    )
  }
}

class SafeAreaIcon extends React.PureComponent<{ isCurrent: boolean }> {
  render() {
    const { isCurrent } = this.props
    const col = isCurrent ? '#ffffff' : '#848484'
    return (
      <svg width="22px" height="22px" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="outer"
            x="3"
            y="3"
            width="16"
            height="16"
            rx="1"
            ry="1"
            stroke-width="1.3"
            stroke={col}
            fill="none"
          />

          <rect id="top" x="10" y="1" width="2" height="5" fill={col} />
          <rect id="bottom" x="10" y="16" width="2" height="5" fill={col} />
          <rect id="left" x="1" y="10" width="5" height="2" fill={col} />
          <rect id="right" x="16" y="10" width="5" height="2" fill={col} />
        </g>
      </svg>
    )
  }
}

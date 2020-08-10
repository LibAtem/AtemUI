import { Container, Row, ButtonGroup, Button } from 'react-bootstrap'
import React from 'react'
import multiview1 from './assets/multiview1.svg'
import multiview2 from './assets/multiview2.svg'
import multiview3 from './assets/multiview3.svg'
import multiview4 from './assets/multiview4.svg'
import { StickyPanelBase } from '../Control/Settings/base'
import { SendCommandStrict } from '../device-page-wrapper'
import { LibAtemState, LibAtemEnums } from '../generated'
import { SourcesMap, SourceSelectInput, AtemButtonBar } from '../components'

// class MvButton extends React.Component {
//     render() {
//         return <Button />
//     }
// }

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

    // const isLeft = index === 0
    // const isPreview = isLeft !== mv.properties.programPreviewSwapped
    // mv.win

    return <div className="mutliViewItem programPreview">{name}</div>
  }

  private renderSmallGrid(
    info: LibAtemState.InfoState_MultiViewInfoState,
    mv: LibAtemState.MultiViewerState,
    boxIds: [number, number, number, number]
  ) {
    const mvIndex = this.state.page
    return (
      <div className="multiViewSubGrid">
        {boxIds.map((i) => (
          <div key={i} className="mutliViewItem">
            {info.canRouteInputs ? (
              <SourceSelectInput
                label={null}
                sources={this.props.sources}
                sourceAvailability={LibAtemEnums.SourceAvailability.Multiviewer}
                value={mv.windows[i].source}
                onChange={(v) => {
                  this.props.sendCommand('LibAtem.Commands.Settings.Multiview.MultiviewWindowInputSetCommand', {
                    MultiviewIndex: mvIndex,
                    WindowIndex: i,
                    Source: v,
                  })
                }}
              />
            ) : (
              this.props.sources.get(mv.windows[i].source)?.longName ?? ''
            )}
          </div>
        ))}
      </div>
    )
  }

  private renderContent(info: LibAtemState.InfoState_MultiViewInfoState, mv: LibAtemState.MultiViewerState) {
    if (info.supportsQuadrantLayout) {
      return <div>TODO</div>
    } else {
      var layout = [] as number[][]
      if (mv.properties.layout == 3) {
        layout = [[2, 3, 6, 7], [4, 5, 8, 9], [0], [1]]
      } else if (mv.properties.layout == 5) {
        layout = [[2, 3, 4, 5], [0], [6, 7, 8, 9], [1]]
      } else if (mv.properties.layout == 10) {
        layout = [[0], [2, 3, 4, 5], [1], [6, 7, 8, 9]]
      } else if (mv.properties.layout == 12) {
        layout = [[0], [1], [2, 3, 6, 7], [4, 5, 8, 9]]
      }
      var content = []
      for (var i = 0; i < layout.length; i++) {
        if (layout[i].length == 1) {
          content.push(this.renderLegacyLargeWindow(mv, layout[i][0]))
        } else {
          content.push(this.renderSmallGrid(info, mv, layout[i] as any))
        }
      }

      return content
    }
  }

  render() {
    const mvIndex = this.state.page
    const mv = this.props.multiViewers[mvIndex]
    const info = this.props.info

    if (!mv || !info) {
      return <div>Missing state</div>
    }

    return (
      <Container className="maxW">
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
        {info.canChangeLayout ? (
          <Row className="justify-content-md-center p-5">
            <ButtonGroup aria-label="Basic example">
              <Button
                variant={mv.properties.layout == 12 ? 'primary' : 'secondary'}
                onClick={() =>
                  this.props.sendCommand('LibAtem.Commands.Settings.Multiview.MultiviewPropertiesSetV8Command', {
                    MultiviewIndex: mvIndex,
                    Mask: 1,
                    Layout: 12,
                  })
                }
              >
                <img src={multiview1} alt="1" />
              </Button>
              <Button
                variant={mv.properties.layout == 3 ? 'primary' : 'secondary'}
                onClick={() =>
                  this.props.sendCommand('LibAtem.Commands.Settings.Multiview.MultiviewPropertiesSetV8Command', {
                    MultiviewIndex: mvIndex,
                    Mask: 1,
                    Layout: 3,
                  })
                }
              >
                <img src={multiview2} alt="2" />
              </Button>
              <Button
                variant={mv.properties.layout == 10 ? 'primary' : 'secondary'}
                onClick={() =>
                  this.props.sendCommand('LibAtem.Commands.Settings.Multiview.MultiviewPropertiesSetV8Command', {
                    MultiviewIndex: mvIndex,
                    Mask: 1,
                    Layout: 10,
                  })
                }
              >
                <img src={multiview3} alt="3" />
              </Button>
              <Button
                variant={mv.properties.layout == 5 ? 'primary' : 'secondary'}
                onClick={() =>
                  this.props.sendCommand('LibAtem.Commands.Settings.Multiview.MultiviewPropertiesSetV8Command', {
                    MultiviewIndex: mvIndex,
                    Mask: 1,
                    Layout: 5,
                  })
                }
              >
                <img src={multiview4} alt="4" />
              </Button>
            </ButtonGroup>
          </Row>
        ) : (
          ''
        )}
        <div className="multiViewGrid">{this.renderContent(info, mv)}</div>
      </Container>
    )
  }
}

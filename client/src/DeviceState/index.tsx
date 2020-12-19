import React from 'react'
import { AtemDeviceInfo } from '../Devices/types'
import TreeMenu, { TreeNodeObject, TreeNode, ItemComponent } from 'react-simple-tree-menu'
import { literal } from '../util'
import { LibAtemState } from '../generated'
import { ErrorBoundary } from '../errorBoundary'
import { DevicePageWrapper, SendCommandStrict } from '../device-page-wrapper'
import { Container } from 'react-bootstrap'

export class StateViewerPage extends DevicePageWrapper {
  renderContent(_sendCommand: SendCommandStrict, deviceState: LibAtemState.AtemState) {
    return (
      <ErrorBoundary key={this.context.activeDeviceId || ''}>
        <StateViewerPageInner currentState={deviceState} />
      </ErrorBoundary>
    )
  }
}

interface StateViewerPageInnerProps {
  currentState: LibAtemState.AtemState
}
interface StateViewerPageInnerState {}

class StateViewerPageInner extends React.Component<StateViewerPageInnerProps, StateViewerPageInnerState> {
  constructor(props: StateViewerPageInnerProps) {
    super(props)

    this.state = {}
  }

  render() {
    const { currentState } = this.props

    return (
      <Container>
        <h1>Device State</h1>
        <TreeMenu
          data={transformStateToTree(currentState, [])}
          onClickItem={() => {}}
          matchSearch={(props) => {
            // This is bad and doesnt show the parents of the results, so it is hard to read..
            // TODO fix and enable it
            const path = (props.path || []) as string[]
            const { searchTerm } = props
            return !!path.find((p) => p.indexOf(searchTerm) !== -1)
          }}
        >
          {({ search, items }) => (
            <>
              {/* <input onChange={e => (search ? search(e.target.value) : undefined)} placeholder="Type and search" /> */}
              <ul className="tree-item-group compact-tree">
                {items.map(({ key, onClick, toggleNode, ...props }) => (
                  <ItemComponent
                    key={key}
                    onClick={(e) => {
                      onClick(e)
                      if (toggleNode) toggleNode()
                    }}
                    {...props}
                  />
                ))}
              </ul>
            </>
          )}
        </TreeMenu>
      </Container>
    )
  }
}

function transformStateToTree(state: object, parents: string[]): TreeNodeObject {
  const res: TreeNodeObject = {}

  Object.keys(state).forEach((key, i) => {
    if (state.hasOwnProperty(key)) {
      const path = [...parents, key]
      const value = (state as any)[key]
      const children = value !== null && typeof value === 'object' ? transformStateToTree(value, path) : undefined

      res[key] = literal<TreeNode>({
        label: children ? key : `${key}: ${value}`,
        index: i,
        nodes: children,
        path: path,
      })
    }
  })

  return res
}

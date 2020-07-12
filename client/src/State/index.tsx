import React from 'react'
import { Container } from 'react-bootstrap'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext } from '../DeviceManager'
import TreeMenu, { TreeNodeObject, TreeNode, ItemComponent } from 'react-simple-tree-menu'
import { literal } from '../util'
import { isObject } from 'util'
import { LibAtemState } from '../generated'

export class StateViewerPage extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>
  static contextType = DeviceManagerContext

  render() {
    const device = GetActiveDevice(this.context)
    return (
      <Container>
        <h2>Device State</h2>

        {device ? (
          <StateViewerPageInner
            key={this.context.activeDeviceId || ''}
            device={device}
            currentState={this.context.currentState}
            signalR={this.context.signalR}
          />
        ) : (
          <p>No device selected</p>
        )}
      </Container>
    )
  }
}

interface StateViewerPageInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: LibAtemState.AtemState | null
}
interface StateViewerPageInnerState {
  hasConnected: boolean
}

class StateViewerPageInner extends React.Component<StateViewerPageInnerProps, StateViewerPageInnerState> {
  constructor(props: StateViewerPageInnerProps) {
    super(props)

    this.state = {
      hasConnected: props.device.connected,
    }
  }

  componentDidUpdate(prevProps: StateViewerPageInnerProps) {
    // Should we reload the commandsSpec
    if (
      !this.state.hasConnected &&
      this.props.device.connected // Device first connection
    ) {
      this.setState({
        // TODO - should this be delayed as old data is good enough to get us started
        // currentState: null,
        hasConnected: true
      })
    }
  }

  render() {
    const { currentState } = this.props
    const { hasConnected } = this.state

    if (!hasConnected) {
      return <p>Device is not connected</p>
    } else if (!currentState) {
      return <p>Loading state...</p>
    }

    return (
      <div>
        <TreeMenu
          data={transformStateToTree(currentState, [])}
          onClickItem={() => {}}
          matchSearch={props => {
            // This is bad and doesnt show the parents of the results, so it is hard to read..
            // TODO fix and enable it
            const path = (props.path || []) as string[]
            const { searchTerm } = props
            return !!path.find(p => p.indexOf(searchTerm) !== -1)
          }}
        >
          {({ search, items }) => (
            <>
              {/* <input onChange={e => (search ? search(e.target.value) : undefined)} placeholder="Type and search" /> */}
              <ul className="tree-item-group compact-tree">
                {items.map(({ key, onClick, toggleNode, ...props }) => (
                  <ItemComponent
                    key={key}
                    onClick={e => {
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
      </div>
    )
  }
}

function transformStateToTree(state: object, parents: string[]): TreeNodeObject {
  const res: TreeNodeObject = {}

  Object.keys(state).forEach((key, i) => {
    if (state.hasOwnProperty(key)) {
      const path = [...parents, key]
      const value = (state as any)[key]
      const children = isObject(value) ? transformStateToTree(value, path) : undefined

      res[key] = literal<TreeNode>({
        label: children ? key : `${key}: ${value}`,
        index: i,
        nodes: children,
        path: path
      })
    }
  })

  return res
}

import React from 'react'
import { Container } from 'react-bootstrap'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import TreeMenu, { TreeNodeObject, TreeNode, ItemComponent } from 'react-simple-tree-menu'
import { literal } from '../util'
import { isObject } from 'util'

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
  currentState: any
}
interface StateViewerPageInnerState {
  hasConnected: boolean
  currentState: object | null
}

class StateViewerPageInner extends React.Component<StateViewerPageInnerProps, StateViewerPageInnerState> {
  constructor(props: StateViewerPageInnerProps) {
    super(props)

    this.state = {
      hasConnected: props.device.connected,
      currentState: null
    }

    if (props.device.connected) {
      this.loadDeviceState(props)
    }
  }

  componentDidMount() {
    if(this.props.signalR){
    this.props.signalR.on("state", (state: any) => {
      console.log(state)
        this.setState({ currentState: state })

    })
   }
  }
  
  componentWillUnmount(){
    if(this.props.signalR){
        this.props.signalR.off("state")
    }
  }

  loadDeviceState(props: StateViewerPageInnerProps) {
    if (props.signalR) {
        props.signalR
            .invoke<any>('sendState', GetDeviceId(props.device))
            .then(state => {
            })
            .catch(err => {
                console.error('StateViewer: Failed to load state:', err)
               
            })
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
        currentState: null,
        hasConnected: true
      })
      // now reload
      this.loadDeviceState(this.props)
    }
  }

  render() {
    const { device, signalR } = this.props
    const { hasConnected, currentState } = this.state

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

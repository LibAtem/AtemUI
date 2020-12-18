import React from 'react'
import { AtemDeviceInfo } from '../Devices/types'
import TreeMenu, { TreeNodeObject, TreeNode, ItemComponent } from 'react-simple-tree-menu'
import { literal } from '../util'
import { LibAtemProfile } from '../generated'
import { ErrorBoundary } from '../errorBoundary'
import { DevicePageWrapper } from '../device-page-wrapper'

export class DeviceProfileViewerPage extends DevicePageWrapper {
  renderContent(device: AtemDeviceInfo, signalR: signalR.HubConnection) {
    return (
      <ErrorBoundary key={this.context.activeDeviceId || ''}>
        <DeviceProfileViewerPageInner
          device={device}
          signalR={signalR}
          currentDeviceProfile={this.context.currentProfile}
        />
      </ErrorBoundary>
    )
  }
}

interface DeviceProfileViewerPageInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentDeviceProfile: LibAtemProfile.DeviceProfile | null
}
interface DeviceProfileViewerPageInnerState {
  hasConnected: boolean
}

class DeviceProfileViewerPageInner extends React.Component<
  DeviceProfileViewerPageInnerProps,
  DeviceProfileViewerPageInnerState
> {
  constructor(props: DeviceProfileViewerPageInnerProps) {
    super(props)

    this.state = {
      hasConnected: props.device.connected,
    }
  }

  componentDidUpdate(prevProps: DeviceProfileViewerPageInnerProps) {
    // Should we reload the commandsSpec
    if (
      !this.state.hasConnected &&
      this.props.device.connected // Device first connection
    ) {
      this.setState({
        // TODO - should this be delayed as old data is good enough to get us started
        hasConnected: true,
      })
    }
  }

  render() {
    const { currentDeviceProfile } = this.props
    const { hasConnected } = this.state

    if (!hasConnected) {
      return <p>Device is not connected</p>
    } else if (!currentDeviceProfile) {
      return <p>Loading state...</p>
    }

    return (
      <div>
        <TreeMenu
          data={transformStateToTree(currentDeviceProfile, [])}
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

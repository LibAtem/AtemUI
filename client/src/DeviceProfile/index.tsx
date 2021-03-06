import React from 'react'
import TreeMenu, { TreeNodeObject, TreeNode, ItemComponent } from 'react-simple-tree-menu'
import { literal } from '../util'
import { LibAtemProfile, LibAtemState } from '../generated'
import { ErrorBoundary } from '../errorBoundary'
import { DevicePageWrapper, SendCommandStrict } from '../device-page-wrapper'
import { Container } from 'react-bootstrap'

export class DeviceProfileViewerPage extends DevicePageWrapper {
  renderContent(
    _sendCommand: SendCommandStrict,
    _deviceState: LibAtemState.AtemState,
    deviceProfile: LibAtemProfile.DeviceProfile
  ) {
    return (
      <ErrorBoundary key={this.context.activeDeviceId || ''}>
        <DeviceProfileViewerPageInner currentDeviceProfile={deviceProfile} />
      </ErrorBoundary>
    )
  }
}

interface DeviceProfileViewerPageInnerProps {
  currentDeviceProfile: LibAtemProfile.DeviceProfile
}
interface DeviceProfileViewerPageInnerState {}

class DeviceProfileViewerPageInner extends React.Component<
  DeviceProfileViewerPageInnerProps,
  DeviceProfileViewerPageInnerState
> {
  constructor(props: DeviceProfileViewerPageInnerProps) {
    super(props)

    this.state = {}
  }

  render() {
    const { currentDeviceProfile } = this.props

    return (
      <Container>
        <h1>Device Profile</h1>
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

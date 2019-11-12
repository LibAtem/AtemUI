import React from 'react'
import { Container } from 'react-bootstrap'
import ReactPolling from 'react-polling'
import { AtemDeviceInfo } from './types'
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react'
import moment from 'moment'
// import { GriddleGrid } from '../util/griddle'

interface DevicesState {
  devices: AtemDeviceInfo[]
}

export class DevicesPage extends React.Component<{}, DevicesState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      devices: []
    }
  }

  render() {
    return (
      <Container>
        <h2>Devices</h2>

        <ReactPolling
          url={'/api/devices'}
          method={'GET'}
          interval={1000}
          onSuccess={data => {
            this.setState({ devices: data })
            return true
          }}
          render={({ isPolling }) => {
            if (isPolling) {
              return (
                <div>
                  <Griddle
                    data={this.state.devices}
                    plugins={[plugins.LocalPlugin, plugins.LegacyStylePlugin]}
                    enableSettings={false}
                    pageProperties={{ pageSize: 20 }}
                  >
                    <RowDefinition>
                      <ColumnDefinition id="name" title="Name" />
                      <ColumnDefinition id="address" title="Address" />
                      <ColumnDefinition
                        id="lastSeen"
                        title="Last Seen"
                        customComponent={({ value }) => <span>{moment(value).format('HH:mm:ss DD-MM-YYYY')}</span>}
                      />
                    </RowDefinition>
                  </Griddle>
                </div>
              )
            } else {
              return <div>Device polling stopped...</div>
            }
          }}
        />
      </Container>
    )
  }
}

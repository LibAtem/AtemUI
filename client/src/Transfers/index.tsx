import React from 'react'
import { Container, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap'
import { AtemTransferStatus } from './types'
import moment from 'moment'
import { DeviceManagerContext } from '../DeviceManager'

interface DevicesTableProps {
  transfers: AtemTransferStatus[]
}

class TransfersTable extends React.Component<DevicesTableProps> {
  render() {
    return (
      <Table striped>
        <thead>
          <tr>
            <td>Id</td>
            <td>Queued</td>
            <td>RAW</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {this.props.transfers.map((ts) => (
            <tr key={`${ts.deviceId}:${ts.queuedAt}`}>
              <td>{ts.deviceId}</td>
              <td>{moment(ts.queuedAt).format('HH:mm:ss DD-MM-YYYY')}</td>
              <td>{JSON.stringify(ts)}</td>
            </tr>
          ))}
          {this.props.transfers.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                No transfers
              </td>
            </tr>
          ) : (
            ''
          )}
        </tbody>
      </Table>
    )
  }
}

interface TransfersState {}

export class TransfersPage extends React.Component<{}, TransfersState> {
  // declare context: React.ContextType<typeof DeviceManagerContext>
  context!: React.ContextType<typeof DeviceManagerContext>
  static contextType = DeviceManagerContext

  constructor(props: {}) {
    super(props)

    this.state = {}
  }

  render() {
    const { transfers, signalR } = this.context

    if (!signalR) {
      return (
        <Container>
          <h2>Transfers</h2>

          <p>Not connected</p>
        </Container>
      )
    }

    return (
      <Container>
        <h2>Transfers</h2>

        <div>
          <TransfersTable transfers={transfers} />
        </div>
      </Container>
    )
  }
}

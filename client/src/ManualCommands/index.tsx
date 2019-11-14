import React from 'react'
import { Container } from 'react-bootstrap'

interface ManualCommandsState {}

export class ManualCommandsPage extends React.Component<{}, ManualCommandsState> {
  constructor(props: {}) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <Container>
        <h2>Manual Commands</h2>
      </Container>
    )
  }
}

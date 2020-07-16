import React from 'react'
import { ErrorBoundary as LibErrorBoundary } from 'react-error-boundary'

export class ErrorBoundary extends React.Component {
  render() {
    return (
      <LibErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className="atem-form error-boundary">
            <div role="alert">
              <div className="atem-heading">This component encountered an error:</div>
              <div className="atem-note">{error?.message}</div>
              <button className="atem-button" onClick={() => resetErrorBoundary()}>
                Try again
              </button>
            </div>
          </div>
        )}
      >
        {this.props.children}
      </LibErrorBoundary>
    )
  }
}

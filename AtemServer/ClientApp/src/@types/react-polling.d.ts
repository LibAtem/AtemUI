declare module 'react-polling' {
  export interface ReactPollingRenderProps {
    startPolling: () => void
    stopPolling: () => void
    isPolling: boolean
  }

  export interface ReactPollingProps {
    url?: string
    interval?: number
    retryCount?: number
    onSuccess: (response: any) => boolean
    onFailure?: (error: any) => void
    method?: string
    headers?: object
    body?: object
    render: (props: ReactPollingRenderProps) => React.Element
    // children?: any
  }

  export default class ReactPolling extends React.Component<ReactPollingProps> {}
}

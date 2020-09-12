declare module 'react-graceful-image' {
  export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    // TODO - general html props
    placeholderColor?: string
    noPlaceholder?: boolean
    customPlaceholder?: unknown
    retry?: { count: number; delay: number; acculumate?: 'add' | 'multiply' }
    onLoad?: () => void
    onError?: () => void
    noLazyLoad?: boolean
  }

  export default function Image(props: ImageProps): JSX.Element
}

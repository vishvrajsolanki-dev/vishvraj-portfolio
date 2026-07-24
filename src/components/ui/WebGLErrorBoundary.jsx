import { Component } from 'react'

export default class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { crashed: false }
  }

  static getDerivedStateFromError() {
    return { crashed: true }
  }

  componentDidCatch(error) {
    console.warn('[WebGLErrorBoundary] Canvas crashed:', error?.message || error)
  }

  render() {
    if (this.state.crashed) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden="true"
        />
      )
    }
    return this.props.children
  }
}

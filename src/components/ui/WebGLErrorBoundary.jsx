import { Component } from 'react';

export default class WebGLErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { crashed: false };
    }

    static getDerivedStateFromError() {
        return { crashed: true };
    }

    componentDidCatch(error) {
        console.warn('[WebGLErrorBoundary] Canvas crashed:', error.message);
    }

    render() {
        if (this.state.crashed) {
            // Silent fallback — dark box, no white screen
            return (
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }} />
            );
        }
        return this.props.children;
    }
}

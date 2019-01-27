import * as React from 'react'

class ErrorBoundary extends React.Component {
    static getDerivedStateFromError() {
        return { hasError: true }
    }

    state = {
        hasError: false,
    }

    componentDidCatch(error: any, info: any) {
        console.log({ error, info })
    }

    render() {
        if (this.state.hasError) {
            return <p>Something went wrong.</p>
        }

        return this.props.children
    }
}

export default ErrorBoundary

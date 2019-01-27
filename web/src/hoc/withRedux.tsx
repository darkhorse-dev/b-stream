import * as React from 'react'

import { store } from '../store'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState: object) {
    if (isServer) {
        return store(initialState)
    }

    if (!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = store(initialState)
    }

    return window[__NEXT_REDUX_STORE__]
}

export default (App: any) => {
    return class AppWithRedux extends React.Component {
        static async getInitialProps(appContext: any) {
            const reduxStore = getOrCreateStore({})

            // Provide the store to getInitialProps of pages
            appContext.ctx.reduxStore = reduxStore

            let appProps = {}
            if (typeof App.getInitialProps === 'function') {
                appProps = await App.getInitialProps(appContext)
            }

            return {
                ...appProps,
                initialReduxState: reduxStore.getState(),
            }
        }

        reduxStore: any

        constructor(props: any) {
            super(props)

            this.reduxStore = getOrCreateStore(props.initialReduxState)
        }

        render() {
            return <App {...this.props} reduxStore={this.reduxStore} />
        }
    }
}

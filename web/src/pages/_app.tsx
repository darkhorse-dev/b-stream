import * as React from 'react'
import App, { Container } from 'next/app'
import { PageTransition } from 'next-page-transitions'
import { Provider } from 'react-redux'

import withRedux from '../hoc/withRedux'
import { Header, Wrapper } from '../components'
class MyApp extends App {
    static async getInitialProps({ Component, ctx }: any) {
        let pageProps = {}

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return { pageProps }
    }

    props: any

    render() {
        const { Component, pageProps, reduxStore } = this.props
        return (
            <Container>
                <Provider store={reduxStore}>
                    <PageTransition
                        timeout={400}
                        classNames="page-transition"
                        loadingDelay={500}
                        loadingTimeout={{
                            enter: 400,
                            exit: 0,
                        }}
                        loadingClassNames="loading-indicator">
                        <>
                            <Header />
                            <Wrapper>
                                <Component {...pageProps} />
                            </Wrapper>
                        </>
                    </PageTransition>
                </Provider>
            </Container>
        )
    }
}

export default withRedux(MyApp)

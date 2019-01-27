require('dotenv-safe').config()
const path = require('path')
const Dotenv = require('dotenv-webpack')
const withTypescript = require('@zeit/next-typescript')
const withCss = require('@zeit/next-css')
const withImages = require('next-images')

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
    require.extensions['.css'] = file => {}
}

module.exports = withTypescript(
    withCss(
        withImages({
            webpack(config) {
                config.plugins = config.plugins || []

                config.plugins = [
                    ...config.plugins,

                    // Read the .env file
                    new Dotenv({
                        path: path.join(__dirname, '.env'),
                        systemvars: true,
                    }),
                ]

                return config
            },
        })
    )
)

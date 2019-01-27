module.exports = {
    apps: [
        {
            name: 'api',
            script: './build/index.js',
            watch: true,
            instances: 4,
            exec_mode: 'cluster',
            max_restarts: 5,
            env: {
                PORT: 8080,
                NODE_ENV: 'development',
            },
            env_production: {
                PORT: 8080,
                NODE_ENV: 'production',
            },
        },
    ],
}

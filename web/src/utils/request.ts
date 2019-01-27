import http from 'http'
import https from 'https'
import axios, { AxiosRequestConfig } from 'axios'

export default (opts?: AxiosRequestConfig) => {
    const headers = {
        'Content-Type': 'application/json',
    }
    if (opts && opts.headers) {
        Object.assign(headers, opts.headers)
    }

    return axios.create({
        headers,
        timeout: 5000,
        httpAgent: new http.Agent({ keepAlive: true }),
        httpsAgent: new https.Agent({ keepAlive: true }),
        maxRedirects: 10,
        maxContentLength: 50 * 1024 * 1024, // 50mb
        withCredentials: true,
        ...opts,
    })
}

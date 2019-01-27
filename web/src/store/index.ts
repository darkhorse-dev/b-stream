import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk from 'redux-thunk'

import reducers from './reducers'

const initialUser = {}
if (typeof Storage !== 'undefined') {
    const unParsedUser = localStorage.getItem('user')
    const user = unParsedUser && JSON.parse(unParsedUser)
    Object.assign(initialUser, user)
}

export function store(initialState = {}) {
    Object.assign(initialState, {
        user: initialUser,
    })

    return createStore(
        reducers,
        initialState,
        composeWithDevTools(applyMiddleware(reduxThunk))
    )
}

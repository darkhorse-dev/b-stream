import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import Link from 'next/link'

import * as trackActions from '../store/actions'
import { tracksEndpoint } from '../api/Endpoints'

interface IndexProps {
    basicLogin: (...args: any) => {}
    basicRegister: (...args: any) => {}
    uploadTrack: (...args: any) => {}
    getTrack: (...args: any) => {}
    getTracks: (...args: any) => {}
    user: any
    track: any
}

interface IndexState {
    user: {}
    track: {}
}

class Index extends React.Component<IndexProps, IndexState> {
    renderTracks = () => {
        const { track } = this.props
        return (
            track.length > 0 && (
                <ul>
                    {track.map((t: any) => {
                        return (
                            <li key={t.id}>
                                <p>{t.id}</p>
                                <p>{t.name}</p>
                                <p>{t.description}</p>
                                <audio
                                    src={`${tracksEndpoint}/stream/${t.id}`}
                                    controls={true}
                                />
                            </li>
                        )
                    })}
                </ul>
            )
        )
    }

    componentDidMount() {
        this.props.getTracks()
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-md-12">
                        <h1>Index goes here</h1>
                        <Link href="/login">
                            <a className="btn btn-primary btn-sm">Login</a>
                        </Link>
                        <Link href="/register">
                            <a className="btn btn-primary btn-sm">Register</a>
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <p>track</p>
                        {this.renderTracks()}
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = ({ track, user }: IndexState) => ({ track, user })
const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(trackActions, dispatch)

const mergeProps = (state: IndexState, dispatch: any) => ({
    ...state,
    ...dispatch,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Index)

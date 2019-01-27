import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

import withAuth from '../hoc/withAuth'
import * as trackActions from '../store/actions/track'
import { TrackUpload, TrackUploadProps } from '../interfaces'

type CustomInput =
    | React.FormEvent<HTMLInputElement>
    | React.FormEvent<HTMLTextAreaElement>

class Upload extends React.Component<TrackUploadProps, TrackUpload> {
    constructor(props: TrackUploadProps) {
        super(props)

        this.state = {
            name: '',
            description: '',
            file: undefined,
            isDownloadable: false,
            isExplicit: false,
            tags: [],
        }
    }

    handleInputUpdates = (e: CustomInput) => {
        const { name, value } = e.currentTarget
        if (name === 'isDownloadable' || name === 'isExplicit') {
            // @ts-ignore
            const checked = e.currentTarget.checked
            this.setState(prevState => ({ ...prevState, [name]: checked }))
        } else if (name === 'file') {
            // @ts-ignore
            const file = e.currentTarget.files[0]
            this.setState(prevState => ({ ...prevState, [name]: file }))
        } else {
            this.setState(prevState => ({ ...prevState, [name]: value }))
        }
    }

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData()
        for (const key in this.state) {
            if (this.state.hasOwnProperty(key)) {
                if (key === 'isExplicit' || key === 'isDownloadable') {
                    formData.append(key, Number(this.state[key]).toString())
                } else {
                    formData.append(key, this.state[key])
                }
            }
        }

        // @ts-ignore
        this.props.uploadTrack(formData)
    }

    render() {
        const {
            name,
            description,
            file,
            isDownloadable,
            isExplicit,
            tags,
        } = this.state

        return (
            <div className="container mt-8 pb-5">
                <h1>Upload</h1>
                <div className="row">
                    <form
                        role="form"
                        encType="multipart/form-data"
                        onSubmit={this.handleSubmit}>
                        <div className="form-group mb-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Name"
                                    name="name"
                                    value={name}
                                    onChange={this.handleInputUpdates}
                                    autoFocus={true}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <div className="input-group">
                                <textarea
                                    name="description"
                                    className="form-control"
                                    placeholder="Description"
                                    value={description}
                                    onChange={this.handleInputUpdates}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <div className="custom-file">
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    accept="audio/mp3"
                                    className="custom-file-input"
                                    onChange={this.handleInputUpdates}
                                    required={true}
                                />
                                <label
                                    htmlFor="file"
                                    className="custom-file-label">
                                    {file && file.name ? (
                                        <p>{file.name}</p>
                                    ) : (
                                        <p>Choose a track</p>
                                    )}
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <div className="custom-control custom-control-alternative custom-checkbox">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="isDownloadable"
                                    name="isDownloadable"
                                    checked={isDownloadable}
                                    onChange={this.handleInputUpdates}
                                />
                                <label
                                    className="custom-control-label"
                                    htmlFor="isDownloadable">
                                    <span className="text-muted">
                                        Is it available for download?
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <div className="custom-control custom-control-alternative custom-checkbox">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="isExplicit"
                                    name="isExplicit"
                                    checked={isExplicit}
                                    onChange={this.handleInputUpdates}
                                />
                                <label
                                    className="custom-control-label"
                                    htmlFor="isExplicit">
                                    <span className="text-muted">
                                        Does it have explicit words?
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tags"
                                    name="tags"
                                    value={tags}
                                    onChange={this.handleInputUpdates}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="btn btn-primary btn-block my-4">
                                Upload
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ track }: any) => ({ track })
const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(trackActions, dispatch)

const mergeProps = (state: any, dispatch: any) => ({
    ...state,
    ...dispatch,
})

export default withAuth(
    connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(Upload)
)

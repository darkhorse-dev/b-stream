import * as React from 'react'
import Link from 'next/link'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as userActions from '../store/actions/user'
import { icons } from '../constants'
import { UserRegister, UserRegisterProps } from '../interfaces'

class Register extends React.Component<UserRegisterProps, UserRegister> {
    state = {
        userName: '',
        email: '',
        password: '',
    }

    handleInputUpdates = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget
        this.setState(prevState => ({ ...prevState, [name]: value }))
    }

    handleBasicRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        this.props.basicRegister(this.state)
    }

    handleFieldValidation = (fields: string[]) => {
        if (fields.length > 0) {
            fields.forEach(field => {
                const fieldElement = document.querySelector(`[name="${field}"]`)

                if (fieldElement) {
                    fieldElement.classList.add('is-invalid')
                }
            })
        }
    }

    handleNavigation = () => {
        window.location.href = '/'
    }

    render() {
        const { user } = this.props
        const { userName, email, password } = this.state
        if (user.id) {
            this.handleNavigation()
        }

        return (
            <div className="container mt-8 pb-5">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-7">
                        <div className="card bg-white shadow border-0">
                            <div className="card-header bg-transparent pb-5">
                                <div className="text-muted text-center mt-2 mb-3">
                                    <small>Sign up with</small>
                                </div>
                                <div className="btn-wrapper text-center">
                                    <a
                                        href="#"
                                        className="btn btn-light btn-icon">
                                        <span className="btn-inner--icon">
                                            <img src={icons.facebook} />
                                        </span>
                                        <span className="btn-inner--text">
                                            Facebook
                                        </span>
                                    </a>
                                    <a
                                        href="#"
                                        className="btn btn-light btn-icon">
                                        <span className="btn-inner--icon">
                                            <img src={icons.google} />
                                        </span>
                                        <span className="btn-inner--text">
                                            Google
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div className="card-body px-lg-5 py-lg-5">
                                {user.error && (
                                    <div className="text-center mb-4">
                                        <p className="text-danger">
                                            {user.message}
                                        </p>
                                        {this.handleFieldValidation(
                                            user.fields
                                        )}
                                    </div>
                                )}
                                <div className="text-center text-muted mb-4">
                                    <small>Or sign up with credentials</small>
                                </div>
                                <form
                                    role="form"
                                    onSubmit={this.handleBasicRegister}>
                                    <div className="form-group mb-3">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fa fa-user" />
                                                </span>
                                            </div>
                                            <input
                                                type="userName"
                                                className="form-control"
                                                placeholder="User Name"
                                                name="userName"
                                                value={userName}
                                                onChange={
                                                    this.handleInputUpdates
                                                }
                                                autoFocus={true}
                                                required={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group mb-3">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fa fa-envelope" />
                                                </span>
                                            </div>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email"
                                                name="email"
                                                value={email}
                                                onChange={
                                                    this.handleInputUpdates
                                                }
                                                required={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fa fa-lock" />
                                                </span>
                                            </div>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Password"
                                                name="password"
                                                value={password}
                                                onChange={
                                                    this.handleInputUpdates
                                                }
                                                required={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block my-4">
                                            Register
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-6">
                                <Link href="/login">
                                    <a>
                                        <small>Already have an account?</small>
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ user }: any) => ({ user })
const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(userActions, dispatch)

const mergeProps = (state: any, dispatch: any) => ({
    ...state,
    ...dispatch,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Register)

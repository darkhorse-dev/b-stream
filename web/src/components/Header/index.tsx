import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import Link from 'next/link'
import Router from 'next/router'

import './header.css'
import Dropdown from './Dropdown'
import * as userActions from '../../store/actions/user'

class Header extends React.Component<any, any> {
    state = {
        isDropdownOpen: false,
    }

    handleLogout = (e: any) => {
        e.preventDefault()

        this.props.logout()
        Router.push('/')
    }

    handleDropdown = (e: any) => {
        e.preventDefault()

        this.setState(({ isDropdownOpen }: any) => ({
            isDropdownOpen: !isDropdownOpen,
        }))
    }

    render() {
        const { user } = this.props
        const { isDropdownOpen } = this.state
        return (
            <header>
                <div className="header">
                    <div className="header__left">
                        <div className="header__left-nav">
                            <div className="header__left-nav-link">
                                <Link href="/">
                                    <a className="header__left-nav-logo">B</a>
                                </Link>
                            </div>
                            <div className="header__left-nav-link">
                                <Link href="/collections">
                                    <a>Collection</a>
                                </Link>
                            </div>
                            <div className="header__left-nav-link">
                                <Link href="/upload">
                                    <a>Upload</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="header__center">
                        <div className="header__center-search">
                            <input
                                type="search"
                                name="search"
                                className="form-control"
                                placeholder="Search for music..."
                            />
                        </div>
                    </div>
                    <div className="header__right">
                        <div className="header__right-nav">
                            <div className="header__right-nav-notification-icon">
                                <a href="#">
                                    <i className="fa fa-bell" />
                                </a>
                            </div>
                            <div className="header__right-nav-user-profile">
                                {user.id ? (
                                    <Dropdown
                                        user={user}
                                        isDropdownOpen={isDropdownOpen}
                                        handleLogout={this.handleLogout}
                                        handleDropdown={this.handleDropdown}
                                    />
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <a className="nav-link">Login</a>
                                        </Link>
                                        <Link href="/register">
                                            <a className="nav-link">Register</a>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}

const mapStateToProps = ({ user }: any) => ({ user })
const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(userActions, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)

import * as React from 'react'

export default ({
    handleDropdown,
    handleLogout,
    isDropdownOpen,
    user,
}: any) => {
    return (
        <div className="dropdown show">
            <button
                onClick={handleDropdown}
                className="tx-gray-800 d-inline-block">
                <div className="ht-45 pd-x-20 d-flex align-items-center justify-content-center">
                    <span className="mg-r-10 tx-13 tx-medium">
                        {user && user.userName}
                    </span>
                    <img
                        src="https://via.placeholder.com/500"
                        className="wd-25 rounded-circle"
                        alt=""
                    />
                    {isDropdownOpen ? (
                        <i className="fa fa-angle-up mg-l-10" />
                    ) : (
                        <i className="fa fa-angle-down mg-l-10" />
                    )}
                </div>
            </button>
            <div
                className={`dropdown-menu pd-10 pos-static-force ft-none ${
                    isDropdownOpen ? 'show' : ''
                }`}>
                <nav className="nav nav-style-1 flex-column">
                    <>
                        <a href="#" className="nav-link">
                            Edit Profile
                        </a>
                        <a href="#" onClick={handleLogout} className="nav-link">
                            Log out
                        </a>
                    </>
                </nav>
            </div>
        </div>
    )
}

export interface UserLogin {
    email: string
    password: string
    rememberMe: boolean
}

export interface UserLoginProps {
    basicLogin: (data: UserLogin) => {}
    user: any
}

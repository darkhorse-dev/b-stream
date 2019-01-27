export interface UserRegister {
    userName: string
    email: string
    password: string
}

export interface UserRegisterProps {
    basicRegister: (data: UserRegister) => {}
    user: any
}

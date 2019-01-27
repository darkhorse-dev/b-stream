export const badDataErrorMsg = (fields?: string[], overwrite?: any) => ({
    fields,
    error: true,
    message: 'Please check the fields in red',
    ...overwrite,
})

export const duplicateUserMsg = (overwrite?: any) => ({
    fields: [],
    error: true,
    message: 'That user already exists, please try with different credentials',
    ...overwrite,
})

export const genericErrorMsg = (overwrite?: any) => ({
    fields: [],
    error: true,
    message: 'Something went wrong please try again',
    ...overwrite,
})

export const userNotFoundErrorMsg = (overwrite?: any) => ({
    fields: [],
    error: true,
    message: "That user doesn't exist",
    ...overwrite,
})

export const invalidCredentialsMsg = (overwrite?: any) => ({
    fields: [],
    error: true,
    message: 'Invalid credentials',
    ...overwrite,
})

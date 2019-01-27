export function code500(
    error = 'Unknown',
    message = 'Something went wrong please try again.'
) {
    return {
        error,
        message,
        status: 500,
    }
}

export function code422(
    error = 'Unacceptable data',
    message = 'The data passed does not meet the reqiurements for this endpoint',
    fields: string[] = []
) {
    return {
        error,
        message,
        fields,
        status: 422,
    }
}

export function code409(
    error = 'Duplicate',
    message = 'Resource already exists'
) {
    return {
        error,
        message,
        status: 409,
    }
}

export function code403(
    error = 'Forbbiden',
    message = 'You cannot perform this action'
) {
    return {
        error,
        message,
        status: 403,
    }
}

export function code401(
    error = 'Unauthorized',
    message = 'Invalid credentials'
) {
    return {
        error,
        message,
        status: 401,
    }
}

export function code404(
    error = 'Not Found',
    message = 'The resource at this endpoint was not found'
) {
    return {
        error,
        message,
        status: 404,
    }
}

export function code204(response = {}, message = 'Resource found') {
    return {
        response,
        message,
        status: 204,
    }
}

export function code200(response = {}, message = 'Success') {
    return {
        response,
        message,
        status: 200,
    }
}

export function code201(response = {}, message = 'Created') {
    return {
        response,
        message,
        status: 201,
    }
}

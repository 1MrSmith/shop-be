import {headers} from '../constants/constant'

export const createSuccessResponse = (status, data) => ({
    statusCode: status,
    headers,
    body: JSON.stringify(data, null, 2)
})

export const createErrorResponse = (error) => {
    const statusCode = error.statusCode || defaultErrorStatusCode
    const errorName = error.name || defaultErrorName
    const errorMessage = error.message || defaultErrorMessage

    const body = {
        statusCode,
            error: {
            name: errorName,
            message: errorMessage
        }
    }

    return {
        statusCode,
        headers,
        body: JSON.stringify(body, null, 2)
    }
}

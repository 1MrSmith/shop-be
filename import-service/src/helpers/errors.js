import {ERROR_NAMES, ERROR_STATUS_CODES} from '../constants/constant'
export class HttpException extends Error {
    constructor(statusCode = 500, name = 'Error', message = 'Internal server error') {
        super()
        this.statusCode = statusCode
        this.name = name
        this.message = message
    }
}

export class BadRequestError extends HttpException {
    constructor(message) {
        super(ERROR_STATUS_CODES.BAD_REQUEST, ERROR_NAMES.BAD_REQUEST, message)
    }
}

export class InternalServerRequestError extends HttpException {
    constructor(message) {
        super(ERROR_STATUS_CODES.INTERNAL_SERVER, ERROR_NAMES.INTERNAL_SERVER, message)
    }
}

export class NotFoundRequestError extends HttpException {
    constructor(message) {
        super(ERROR_STATUS_CODES.NOT_FOUND, ERROR_NAMES.NOT_FOUND, message)
    }
}

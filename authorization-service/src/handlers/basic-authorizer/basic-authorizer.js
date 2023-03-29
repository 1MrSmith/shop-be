import {createSuccessResponse} from '../../utils/api'
import {LOGIN} from '../../constants/constant'

export const handler = (event, context, callback) => {

    if (event.type !== 'TOKEN') {
        callback('Unauthorized')
    }

    const encoded = event.authorizationToken.split('Basic ')[1].split('.')[1]

    if (!encoded) {
        callback('Unauthorized')
    }

    const token = JSON.parse(Buffer.from(encoded, 'base64'))

    const {user, password} = token

    if (user === LOGIN && password === process.env['MrSmith']) {
        callback(null, createSuccessResponse('user', 'Allow', event.methodArn))
    } else {
        callback(null, createSuccessResponse('user', 'Deny', event.methodArn))
    }
}

import AWS from 'aws-sdk-mock'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {handler} from './import-products-file'
import {BadRequestError} from '../../helpers/errors'
import {createErrorResponse, createSuccessResponse} from '../../utils/api'

jest.mock('../../utils/api', () => ({
    createSuccessResponse: jest.fn(),
    createErrorResponse: jest.fn(),
}))

AWS.mock('S3', 'getSignedUrl', function (method, params, callback) {
    callback(null, 'https://aws:s3:test.csv')
})

jest.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: jest.fn(),
}))

describe('import', () => {

    test('should return error if name was not passed', async () => {
        await handler({queryStringParameters: {name: ''}})
    
        expect(createErrorResponse).toHaveBeenCalledWith(new BadRequestError('Invalid name params'))
    })

    test('should be called', async () => {
        const name = 'test.csv'
        await handler({queryStringParameters: {name}})

        expect(getSignedUrl).toHaveBeenCalled()
    })
})

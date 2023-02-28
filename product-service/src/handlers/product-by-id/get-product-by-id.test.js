import {createErrorResponse, createSuccessResponse} from '../../utils/api'
import {BadRequestError, NotFoundRequestError} from '../../helpers/errors'

import {handler} from './get-product-by-id'

import products from '../../mocks/products.json'

jest.mock('../../utils/api', () => ({
    createSuccessResponse: jest.fn(),
    createErrorResponse: jest.fn(),
}))

describe('get-product-by-id', () => {
    test('should return specific item', async () => {
        await handler({pathParameters: {id: 1}})

        expect(createSuccessResponse).toHaveBeenCalledWith(products.find(item => item.id === 1))
    })

    test('should return 404 error if item not found', async () => {
        await handler({pathParameters: {id: 30}})

        expect(createErrorResponse).toHaveBeenCalledWith(new NotFoundRequestError('Product with id = 30 not found'))
    })

    test('should return 400 error if bad requests params', async () => {
        await handler({pathParameters: {id: 'NaN'}})

        expect(createErrorResponse).toHaveBeenCalledWith(new BadRequestError('Invalid id params'))
    })
})

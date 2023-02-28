import {createSuccessResponse} from '../../utils/api'
import {handler} from './get-products-list'

import products from '../../mocks/products.json'

jest.mock('../../utils/api', () => ({
    createSuccessResponse: jest.fn(),
}))

describe('get-products-list', () => {
    test('should return all items', async () => {
        await handler()

        expect(createSuccessResponse).toHaveBeenCalledWith(products)
    })
})

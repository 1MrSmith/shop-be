import AWS from 'aws-sdk-mock'
import {createProduct} from '../../services/product-service'
import {handler} from './catalog-batch-process'

jest.mock('../../services/product-service', () => ({
    createProduct: jest.fn(),
}))

describe('catalog-batch-process', () => {
    test('should notify sns if product created', async () => {
        AWS.mock('SNS', 'publish', () => console.log('notify'));

        const result = await handler({ Records: [{ body: '{"a": 1}' }, { body: '{"b": 2}' }] });

        expect(createProduct).toHaveBeenCalledTimes(2);

        expect(result.statusCode).toEqual(200);
    })
})

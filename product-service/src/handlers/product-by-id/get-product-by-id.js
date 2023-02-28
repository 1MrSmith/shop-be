import {BadRequestError, NotFoundRequestError} from '../../helpers/errors'
import {createErrorResponse, createSuccessResponse} from '../../utils/api'

import products from '../../mocks/products.json'

export const handler = async (event) => {
    const {id} = event.pathParameters

    if (isNaN(id) || id < 0) {
        return createErrorResponse(new BadRequestError('Invalid id params'))
    }

    const product = products.find(product => product.id === +id)

    if (!product) {
        return createErrorResponse(new NotFoundRequestError(`Product with id = ${id} not found`))
    }


    return createSuccessResponse(product)
}

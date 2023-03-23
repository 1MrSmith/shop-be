import Ajv from 'ajv'
import {createSuccessResponse, createErrorResponse} from '../../utils/api'
import {BadRequestError, InternalServerRequestError} from '../../helpers/errors'
import {createProduct} from '../../services/product-service'
import {schema} from '../../types/coin'

export const handler = async (data) => {
    const parseData = JSON.parse(data.body)

    if (!Object.keys(parseData).length) {
        return createErrorResponse(new BadRequestError('Empty body'))
    }

    const ajv = new Ajv()

    if (!ajv.validate(schema, parseData)) {
        return createErrorResponse(new BadRequestError('Bad Request'))
    }

    try {
        const {title, description, price, count} = parseData
        const createdProduct = await createProduct({title, description, price, count})

        return createSuccessResponse(createdProduct)
    } catch (e) {

        return createErrorResponse(new InternalServerRequestError('Internal server error'))
    }
}

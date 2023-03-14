import {validate as uuidValidate} from 'uuid';
import {BadRequestError, NotFoundRequestError, InternalServerRequestError} from '../../helpers/errors'
import {createErrorResponse, createSuccessResponse} from '../../utils/api'
import {getProductById} from '../../services/product-service'

export const handler = async (event) => {
    const {id} = event.pathParameters

    console.log('id', id)

    if (!uuidValidate(id)) {
        return createErrorResponse(new BadRequestError('Invalid id params'))
    }

    try {
        const product = await getProductById(id)

        if (!product) {
            return createErrorResponse(new NotFoundRequestError(`Product with id = ${id} not found`))
        }

        return createSuccessResponse(product)
    } catch (e) {

        return createErrorResponse(new InternalServerRequestError('Internal server error'))
    }
}

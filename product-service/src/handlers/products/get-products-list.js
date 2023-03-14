import {createSuccessResponse, createErrorResponse} from '../../utils/api'
import {InternalServerRequestError} from '../../helpers/errors'
import {getProductsList} from '../../services/product-service'

export const handler = async () => {
    try {
        const products = await getProductsList()
        return createSuccessResponse(products)
    } catch (e) {

        return createErrorResponse(new InternalServerRequestError('Internal server error'))
    }
}

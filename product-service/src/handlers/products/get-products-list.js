import {createSuccessResponse} from '../../utils/api'

import products from '../../mocks/products.json'

export const handler = async () => createSuccessResponse(products)

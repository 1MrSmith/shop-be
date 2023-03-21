export const defaultErrorStatusCode = 500
export const defaultErrorName = 'Error'
export const defaultErrorMessage = 'Internal server error'

export const ERROR_NAMES = {
    BAD_REQUEST: 'BAD_REQUEST',
    NOT_FOUND: 'NOT_FOUND',
    INTERNAL_SERVER: 'INTERNAL_SERVER'
}

export const ERROR_STATUS_CODES = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500
}

export const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET"
}

export const stocksTableName = 'Stocks'
export const productsTableName = 'Products'

export const FOLDER_NAME = 'uploaded'
export const BUCKET_NAME = 'upload-coins'
export const PARSED_NAME = 'parsed'

export const SQS_URL = 'https://sqs.eu-west-1.amazonaws.com/954413109841/catalogItemsQueue'

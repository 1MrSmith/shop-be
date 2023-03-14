import {v4 as uuidv4} from 'uuid'
import {DynamoDB} from 'aws-sdk'
import {stocksTableName, productsTableName} from '../constants/constant'

const dynamo = new DynamoDB.DocumentClient()

export const getProductsList = async () => {
    const result = await dynamo.scan({TableName: productsTableName}).promise()
    const products = result.Items

    return Promise.all(products.map((product) => convertToAvailableProduct(product)))
}

export const getProductById = async (id) => {
    const result = await dynamo.query({
        TableName: productsTableName,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {':id': id}
    }).promise()
    const product = result.Items[0]
    if (!product) {
        return null
    }

    return convertToAvailableProduct(product)
}

export const createProduct = async (data) => {
    const {title, description, price, count} = data
    const product = {id: uuidv4(), title, description, price}
    const stock = {product_id: product.id, count: count}

    await dynamo.transactWrite({
      TransactItems: [
        {
            Put: {
                TableName: productsTableName,
                Item: product
            },
        },
        {
            Put: {
                TableName: stocksTableName,
                Item: stock
            }
        }
      ]
    }).promise()

    return getProductById(product.id)
}

export const getStockByProductId = async (productId) => {
    const result = await dynamo.query({
        TableName: stocksTableName,
        KeyConditionExpression: 'product_id = :productId',
        ExpressionAttributeValues: {':productId': productId}
    }).promise()
    const stock = result.Items[0]

    return (stock || null)
}

export const convertToAvailableProduct = async (product) => {
    const stock = await getStockByProductId(product.id)

    const availableProduct = {
        ...product,
        count: stock?.count || 0
    }

    return availableProduct
}

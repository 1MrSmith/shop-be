import {DynamoDB} from 'aws-sdk'
import {stocksTableName, productsTableName} from '../constants/constant'
import mockProducts from '../mocks/products.json'

const products = mockProducts.map(({count, ...product}) => product)
const stocks = mockProducts.map(({id, count}) => ({product_id: id, count}))

const dynamo = new DynamoDB.DocumentClient()

const createProduct = async (product) => {
    return dynamo.put({
        TableName: productsTableName,
        Item: product
    }).promise()
}

const createStock = async (stock) => {
    return dynamo.put({
        TableName: stocksTableName,
        Item: stock
    }).promise()
}

export const handler = async (event) => {
    try {
        await Promise.all(products.map(item => createProduct(item)))
        await Promise.all(stocks.map(item => createStock(item)))
    } catch (e) {
        console.log(e)
    }
}
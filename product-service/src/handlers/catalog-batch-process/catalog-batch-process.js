import {SNSClient, PublishCommand} from '@aws-sdk/client-sns'
import {createSuccessResponse, createErrorResponse} from '../../utils/api'
import {InternalServerRequestError} from '../../helpers/errors'
import {SNS_ARN} from '../../constants/constant'
import {createProduct} from '../../services/product-service'

export const handler = async (event) => {

    const snsClient = new SNSClient({region: 'eu-west-1'})

    try {
        for (const record of event.Records) {
            const data = JSON.parse(record.body)

            const newProduct = await createProduct(data)

            if (newProduct) {
                const publishCommand = new PublishCommand({
                Subject: 'New product created',
                Message: JSON.stringify(data),
                MessageAttributes: {
                    title: {
                    DataType: 'String',
                    StringValue: data.title,
                    }
                },
                TopicArn: SNS_ARN
                })

                await snsClient.send(publishCommand)
            }
        }

        return createSuccessResponse(202, {
            message: 'Product has been created'
        })
    } catch (error) {

        return createErrorResponse(new InternalServerRequestError('Internal server error'))
    }
}

import {
    S3Client,
    GetObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import {SQSClient, SendMessageCommand} from '@aws-sdk/client-sqs'
import csv from 'csv-parser'
import stream from 'stream'
import util from 'util'
import {createSuccessResponse, createErrorResponse} from '../../utils/api'
import {InternalServerRequestError} from '../../helpers/errors'
import {BUCKET_NAME, PARSED_NAME, FOLDER_NAME, SQS_URL} from '../../constants/constant'

export const handler = async (event) => {

    const finished = util.promisify(stream.finished)
    const sqsClient = new SQSClient({region: 'eu-west-1'})
    const s3Client = new S3Client({region: 'eu-west-1'})

    const results = []
    try {

        for (const record of event.Records) {
            const bucketParams = {
                Bucket: BUCKET_NAME,
                Key: record.s3.object.key
            }

            const getObject = new GetObjectCommand(bucketParams)
            const s3Object = await s3Client.send(getObject)

            await finished(
                s3Object.Body.pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', () => {
                        console.log('CSV has successfully parsed')
                    })
                )

            results.map((item) => {
                sqsClient.send(
                    new SendMessageCommand({
                        MessageBody: JSON.stringify(item),
                        QueueUrl: SQS_URL
                    })
                    )
                })

            const copyObjectCommand = new CopyObjectCommand({
                Bucket: BUCKET_NAME,
                CopySource: `${BUCKET_NAME}/${record.s3.object.key}`,
                Key: record.s3.object.key.replace(FOLDER_NAME, PARSED_NAME)
            })

            const {CopyObjectResult} = await s3Client.send(copyObjectCommand)

            const deleteObjectCommand = new DeleteObjectCommand(bucketParams)

            await s3Client.send(deleteObjectCommand)
        }
  
        return createSuccessResponse(202)
    } catch (e) {

        return createErrorResponse(new InternalServerRequestError('Internal server error'))
    }
}

import {
    S3Client,
    GetObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import csv from 'csv-parser'
import {createSuccessResponse, createErrorResponse} from '../../utils/api'
import {InternalServerRequestError} from '../../helpers/errors'
import {BUCKET_NAME, PARSED_NAME, FOLDER_NAME} from '../../constants/constant'

export const handler = async (event) => {

    const s3Client = new S3Client({region: 'eu-west-1'})

    try {

        for (const record of event.Records) {
            const bucketParams = {
                Bucket: BUCKET_NAME,
                Key: record.s3.object.key
            }

            const getObject = new GetObjectCommand(bucketParams)
            const s3Object = await s3Client.send(getObject)

            s3Object.Body.pipe(csv()).on('end', () => {
                console.log('CSV file successfully parsed')
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
  
        return createSuccessResponse(202, {
            message: 'File has been created'
        })
    } catch (e) {

        return createErrorResponse(new InternalServerRequestError('Internal server error'))
    }
}

import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3'
import {createSuccessResponse, createErrorResponse} from '../../utils/api'
import {InternalServerRequestError, BadRequestError} from '../../helpers/errors'
import {FOLDER_NAME, BUCKET_NAME} from '../../constants/constant'

export const handler = async (event) => {
    const name = event.queryStringParameters?.name

    if (!name) {
        createErrorResponse(new BadRequestError('Invalid name params'))
    }

    const s3Client = new S3Client({region: 'eu-west-1'})

    try {
        const objectKey = `${FOLDER_NAME}/${name}`

        const params = {
            Bucket: BUCKET_NAME,
            Key: objectKey
        }

        const putObjectCommand = new PutObjectCommand(params)
        await s3Client.send(putObjectCommand)

        const url = await getSignedUrl(s3Client, putObjectCommand)

        return createSuccessResponse(200, url)
    } catch (e) {
        return createErrorResponse(new InternalServerRequestError('Internal server error'))
    }
}

import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler, secretsManager } from 'middy/middlewares'
// import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import AWS = require('aws-sdk')
import * as AWSXRay from 'aws-xray-sdk';
import { createLogger } from 'src/utils/logger'


const XAWS = AWSXRay.captureAWS(AWS);

const region = process.env.REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY;
const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

const s3 = new XAWS.S3({
  signatureVersion: 'v4',
  region,
  accessKeyId,
  secretAccessKey,
  params: {Bucket: bucketName},
});

const logger = createLogger('getUploadUrl')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const todoId = event.pathParameters.todoId
    logger.info('Getting a signed upload url for todo', todoId)

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const url = await getUploadedUrl(todoId);

    return {
      statusCode: 201,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
          uploadUrl: url
      })
    }
  }
)

async function getUploadedUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: Number(urlExpiration)
    });
}

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
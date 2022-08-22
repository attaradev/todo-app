import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS);
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })

  const logger = createLogger('AttachmentUtills-Helpers')
// TODO: Implement the fileStorage logic
const bucketName = process.env.ATTACHMENT_S3_BUCKET
let urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);
export function createAttachmentPresignedUrl(todoId: string) {
    try {
        logger.info('Making Attempt to get presignedUrl')
    const preSignedUrl =  s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    })
    logger.info(`Successfully Got presignedUrl ${preSignedUrl}`)
    return preSignedUrl;
    } catch(err) {
        logger.info(`Error Occured Getting presignedUrl ${(err as Error).message}`)
    }
    
  }

export function getImageUrl(todoId: string):string {
    return `https://${bucketName}.s3.amazonaws.com/${todoId}`
}
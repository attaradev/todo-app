import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createAttachmentPresignedUrl } from '../../businessLogic/attachmentUtils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    try {
      const preSignedUrl = createAttachmentPresignedUrl(todoId)
      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl: preSignedUrl
        })
      }
    } catch (err) {
      console.log(
        `An Error Occured Inside Lambda to get PresignedUrl:: ${
          (err as Error).message
        }`
      )
      return {
        statusCode: 500,
        body: JSON.stringify({
          msg: (err as Error).message
        })
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)

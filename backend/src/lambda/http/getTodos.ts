import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const userId = getUserId(event)
      const todos = await getTodosForUser(userId)
      return {
        statusCode: 200,
        body: JSON.stringify({
          items: todos
        })
      }
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          msg: (err as Error).message
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

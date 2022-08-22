import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getJwtToken } from '../utils'
import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const { name, dueDate } = newTodo
    if (!dueDate || !name || name.trim() == '') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Name or dueDate cannot be null'
        })
      }
    }

    try {
      const token = getJwtToken(event)
      const created = await createTodo(newTodo, token)
      return {
        statusCode: 201,
        body: JSON.stringify({
          item: created
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

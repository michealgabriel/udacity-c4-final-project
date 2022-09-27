import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateAttachment, updateTodo } from '../../businessLogic/todos'
import { UpdateAttachmentRequest } from '../../requests/UpdateAttachmentRequest'
import { getUserId } from '../utils'
import { createLogger } from 'src/utils/logger'

const logger = createLogger('updateAttachment')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const todoId = event.pathParameters.todoId
    
    logger.info('Updating a todo attachment', todoId)
    
    const data: UpdateAttachmentRequest = JSON.parse(event.body)

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      const userId: string = getUserId(event);
      const update = await updateAttachment(data, userId, todoId);

      return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(
            update
        ),
      }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )

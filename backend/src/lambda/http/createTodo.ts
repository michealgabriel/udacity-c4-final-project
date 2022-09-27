import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from 'src/utils/logger'

const logger = createLogger('createTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    logger.info('Creating a new todo item', event)

    // TODO: Implement creating a new TODO item
     console.log('Processing event: ', event);

      const newTodo: CreateTodoRequest = JSON.parse(event.body);

      const userId: string = getUserId(event);
      const item = await createTodo(newTodo, userId);

      return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          item
        }),
      }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

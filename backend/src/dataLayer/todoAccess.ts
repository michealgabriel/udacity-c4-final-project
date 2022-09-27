import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';

import {TodoItem} from '../models/TodoItem';
import { TodoUpdate } from 'src/models/TodoUpdate';
import { AttachmentUpdate } from 'src/models/AttachmentUpdate';
// import { parseUserId } from 'src/auth/utils';

const XAWS = AWSXRay.captureAWS(AWS);

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) {
    }

    // # GET TODOS FOR USER - FUNCTION
    async getTodosForUser(userId: string): Promise<TodoItem[]> {
        console.log('Getting all todos for user');
        
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: process.env.TODOS_CREATED_AT_INDEX,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise();

        const items = result.Items;
        return items as TodoItem[];
    }

    // # CREATE TODO - FUNCTION
    async createTodo(todo: TodoItem): Promise<TodoItem> {
        console.log(`Creating a todo with id ${todo.todoId}`);
        
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise();

        return todo;
    }

    // # DELETE TODO - FUNCTION
    async deleteTodo(userId: string, todoId: string): Promise<string> {
        console.log(`Deleting a todo with id ${todoId}`);
        
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            }
        }).promise();

        return todoId;
    }

    // # UPDATE TODO - FUNCTION
    async updateTodo(todoUpdateItem: TodoUpdate, userId: string, todoId: string): Promise<TodoUpdate> {
        console.log(`Updating a todo with id ${todoId}`);

        // console.log(todoUpdateItem.attachmentUrl);
        
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: "set #nm = :name, dueDate = :dueDate, done = :done",
            ExpressionAttributeValues: {
                ':name': todoUpdateItem.name,
                ':dueDate': todoUpdateItem.dueDate,
                ':done': todoUpdateItem.done
            },
            ExpressionAttributeNames: {
              "#nm": "name"
            }
        }).promise();

        return todoUpdateItem;
    }

    // # UPDATE ATTACHMENT URL - FUNCTION
    async updateAttachmentURL(newAttachment: AttachmentUpdate, userId: string, todoId: string): Promise<AttachmentUpdate> {
        console.log(`Updating a todo attachment with id ${todoId}`);
        
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: "set attachmentUrl = :attach",
            ExpressionAttributeValues: {
                ':attach': newAttachment.attachment
            }
        }).promise();

        return newAttachment
    }

}
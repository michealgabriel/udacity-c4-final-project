import * as uuid from 'uuid';

import {TodoItem} from '../models/TodoItem';
import {TodoAccess} from '../dataLayer/todoAccess';
import { CreateTodoRequest } from 'src/requests/CreateTodoRequest';
import { getUserId } from 'src/lambda/utils';
import { UpdateTodoRequest } from 'src/requests/UpdateTodoRequest';
import { UpdateAttachmentRequest } from 'src/requests/UpdateAttachmentRequest';

// import {getUserId} from '../auth/utils';

const todoAccess = new TodoAccess();

// # GET TODOS FOR USER - FUNCTION
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return todoAccess.getTodosForUser(userId);
}


// # CREATE TODO - FUNCTION
export async function createTodo(createGroupRequest: CreateTodoRequest, userId: string) {
    const itemId = uuid.v4();
    const timestamp = new Date().toISOString();

    return await todoAccess.createTodo({
        todoId: itemId,
        userId: userId,
        name: createGroupRequest.name,
        createdAt: timestamp,
        dueDate: createGroupRequest.dueDate,
        done: false,
    });
}

// # DELETE TODO - FUNCTION
export async function deleteTodo(userId: string, todoId: string): Promise<string> {
    return await todoAccess.deleteTodo(userId, todoId);
}


// # UPDATE TODO - FUNCTION
export async function updateTodo(updateTodoRequest: UpdateTodoRequest, userId: string, todoId: string){
    
    return todoAccess.updateTodo({
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
    }, userId, todoId);
}


// # UPDATE ATTACHMENT - FUNCTION
export async function updateAttachment(newAttachment: UpdateAttachmentRequest, userId: string, todoId: string){

    return todoAccess.updateAttachmentURL({
        attachment: newAttachment.attachment
    }, userId, todoId);
}
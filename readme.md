# RW Next API Example: Todo Controller CRUD

This example demonstrates how to implement a CRUD (Create, Read, Update, Delete) controller for a Todo application using the `rw-next-api` with Next.js and TypeScript.

## Prerequisites

- Node.js installed
- `rw-next-api` package installed
- TypeScript configured in your Next.js project

## Installation

```bash
npm install rw-next-api
```

## Implementation

### 1. Create your folder route

### Folder Structure

Here's the folder structure for the Todo application example:

```
project-root
├── app
│   ├── api
│   │   └── v1
│   │   │     └── [...v1args]
│   │   │        └── route.ts
│   │   └── v2
│   │       └──[...v2args]
│   │            └── route.ts

├── services
│   └── TodoService.ts
├── controllers
│   └── TodoController.ts
├── public
├── styles
├── package.json
└── tsconfig.json
```

> **Note:** The developer is free to structure their API route paths as they see fit. The example provided follows a versioned API structure (`/api/v1`), but you can organize your routes in a way that best suits your application's needs.

### 2. Create the Todo Service

Create a file named `TodoService.ts`:

```typescript
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [];

export class TodoService {
  static async getAll(): Promise<Todo[]> {
    return todos;
  }

  static async getById(id: number): Promise<Todo | undefined> {
    return todos.find((todo) => todo.id === id);
  }

  static async create(todo: Todo): Promise<Todo> {
    todo.id = todos.length ? todos[todos.length - 1].id + 1 : 1;
    todos.push(todo);
    return todo;
  }

  static async update(
    id: number,
    updatedTodo: Partial<Todo>
  ): Promise<Todo | undefined> {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...updatedTodo };
      return todos[index];
    }
    return undefined;
  }

  static async delete(id: number): Promise<boolean> {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      return true;
    }
    return false;
  }
}
```

### 3. Create the Todo Controller

Create a file named `TodoController.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { TodoService } from '../services/TodoService';
import { Params, Get, Post, Put, Delete, Body, IBody } from 'rw-next-api';

export class TodoController extends NextApiController {
  @Get('/:id')
  async getTodoById(@Params('id') id: number) {
    const todo = await TodoService.getById(id);
    if (todo) {
      return NextResponse.json(todo, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Todo not found' }, { status: 400 });
    }
  }

  @Post('')
  async createTodo(@Body() body: IBody) {
    const data = await body.json();
    const newTodo = await TodoService.create(data);
    return NextResponse.json({ data: newTodo, message: 'Todo created' });
  }

  @Put('/:id')
  async updateTodo(@Params('id') id: number, @Body() body: IBody) {
    const data = await body.json();
    const updatedTodo = await TodoService.update(id, data);
    if (updatedTodo) {
      return NextResponse.json({ data: updatedTodo, message: 'Todo updated' });
    } else {
      return NextResponse.json({ message: 'Todo not found' });
    }
  }

  @Delete('/:id')
  async deleteTodo(@Params('id') id: number) {
    const success = await TodoService.delete(id);
    if (success) {
      return NextResponse.json({ message: 'Todo deleted' });
    } else {
      return NextResponse.json({ message: 'Todo not found' });
    }
  }
}
```

```typescript
//app/api/v1/[...args]/route.ts
import { NextApiRouter } from 'rw-next-api';
import { TodoController } from '../../../controller/TodoController';

// Initialize the NextApiRouter with the base path '/api/v1'
const router = new NextApiRouter('/api/v1');

// Add a route for the TodoController
router.addRoute({
  name: '/todos',
  controller: TodoController,
});

// Get the handler from the router
const handler = router.handler();

// Expose the router handler as methods for different HTTP verbs
export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as OPTIONS,
};
```

### 4. Fetch Todos using cURL

To fetch all todos, you can use the following cURL command:

```bash
curl -X GET http://localhost:3000/api/v1/todos
```

To fetch a specific todo by ID, replace `:id` with the actual ID of the todo:

```bash
curl -X GET http://localhost:3000/api/v1/todos/:id
```

To create a new todo, use the following cURL command with a JSON payload:

```bash
curl -X POST http://localhost:3000/api/v1/todos \
    -H "Content-Type: application/json" \
    -d '{"title": "New Todo", "completed": false}'
```

To update an existing todo, use the following cURL command with a JSON payload and replace `:id` with the actual ID of the todo:

```bash
curl -X PUT http://localhost:3000/api/v1/todos/:id \
    -H "Content-Type: application/json" \
    -d '{"title": "Updated Todo", "completed": true}'
```

To delete a todo, replace `:id` with the actual ID of the todo:

```bash
curl -X DELETE http://localhost:3000/api/v1/todos/:id
```

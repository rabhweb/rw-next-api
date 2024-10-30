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

Here's the folder structure for the Todo application:

```
project-root
├── app
│   ├── api
│   │   └── v1
│   │       └── [...args]
│   │           └── route.ts
├── services
│   └── TodoService.ts
├── controllers
│   └── TodoController.ts
├── public
├── styles
├── package.json
└── tsconfig.json
```

### 1. Create the Todo Service

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

### 2. Create the Todo Controller

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

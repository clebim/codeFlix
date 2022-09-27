import { CreateCategoryController } from '@adapters/controllers/category/create-category-controller';
import { CreateCategoryValidator } from '@external/validators/validation-services/create-category-validator';
import { CreateCategory } from '@usecases/category/create-category-use-case';
import http, { IncomingMessage, ServerResponse, Server } from 'http';

import { Logger } from '@shared/logger';

function getNotFoundPage(request: IncomingMessage, response: ServerResponse) {
  response.setHeader('Content-Type', 'application/json');
  response.writeHead(404);
  response.end(JSON.stringify({ message: 'Page not found' }));
}

async function createCategory(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const controller = new CreateCategoryController(
    new CreateCategory(new Logger(), new CreateCategoryValidator()),
  );
  let body = '';

  request.on('data', (chunk: Buffer) => {
    body += chunk.toString();
  });

  request.on('end', async () => {
    const { body: responseController } = await controller.handle({
      body: JSON.parse(body),
    });
    response.setHeader('Content-Type', 'application/json');
    response.writeHead(200);
    response.end(JSON.stringify(responseController, null, 2));
  });
}

export class App {
  public server: Server;

  constructor() {
    this.startServer();
  }

  private startServer() {
    this.server = http.createServer(this.listener);
  }

  private listener(request: IncomingMessage, response: ServerResponse) {
    try {
      switch (request.url) {
        case '/api/category/create':
          createCategory(request, response);
          break;
        default:
          getNotFoundPage(request, response);
          break;
      }
    } catch (error) {
      console.log(error);
      response.writeHead(500);
      response.end('test');
    }
  }
}

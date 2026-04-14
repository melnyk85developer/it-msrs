import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map, switchMap, from, of } from 'rxjs';

@Injectable()
export class AiStreamInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        

        return next.handle().pipe(
            map(data => {
                // Если клиент не просит стрим — отдаем как есть (JSON)
                if (!request.body.stream) return data;

                // Если нужен стрим — настраиваем заголовки SSE
                response.setHeader('Content-Type', 'text/event-stream');
                response.setHeader('Cache-Control', 'no-cache');
                response.setHeader('Connection', 'keep-alive');

                const content = data.assistantResponse?.content || '';

                // Имитируем чанк для OpenAI/Continue формата
                const chunk = {
                    id: `chatcmpl-${Date.now()}`,
                    object: 'chat.completion.chunk',
                    created: Math.floor(Date.now() / 1000),
                    model: request.body.model,
                    choices: [{
                        index: 0,
                        delta: { content: content },
                        finish_reason: null
                    }]
                };

                // Отправляем данные в поток
                response.write(`data: ${JSON.stringify(chunk)}\n\n`);
                response.write(`data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: 'stop' }] })}\n\n`);
                response.write('data: [DONE]\n\n');

                response.end();
                return; // Завершаем, так как мы сами управляем ответом через response.write
            })
        );
    }
}
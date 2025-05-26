import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { LoggerService } from '@infrastructure/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(LoggingInterceptor.name);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): any {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, user } = req;
    const userId = user?.sub || 'anonymous';

    // Log the request
    this.logger.log({
      message: `Request received`,
      userId,
      method,
      url,
      body,
    });

    const now = Date.now();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (next.handle() as any).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (tap as any)(data => {
        // Log the response
        this.logger.log({
          message: `Request completed`,
          userId,
          method,
          url,
          processingTime: `${Date.now() - now}ms`,
          responseType: typeof data === 'object' ? 'Object' : typeof data,
        });
      }),
    );
  }
}

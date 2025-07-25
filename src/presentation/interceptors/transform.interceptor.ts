import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map } from 'rxjs/operators';

export interface IResponse<T> {
  statusCode: number;
  data: T;
  timestamp: string;
  lang?: string;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): any {
    // Get Accept-Language header from request
    const request = context.switchToHttp().getRequest();
    const acceptLanguage = request.headers['accept-language'];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (next.handle() as any).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map as any)(data => {
        // Handle responses with message field
        let responseData = data;
        let message: string | undefined;

        // Extract a message if it exists in a data object
        if (data && typeof data === 'object' && !Array.isArray(data) && 'message' in data) {
          const { message: msg, ...rest } = data;
          responseData = rest;
          message = msg;
        }

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          data: responseData,
          timestamp: new Date().toISOString(),
          lang: acceptLanguage,
          ...(message && { message }),
        };
      }),
    );
  }
}

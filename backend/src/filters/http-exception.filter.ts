import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Une erreur est survenue. Veuillez réessayer.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      // Handle Passport/JWT errors
      if (exception.message.includes('Unauthorized') || exception.message.includes('Invalid token')) {
        status = HttpStatus.UNAUTHORIZED;
        message = 'Token invalid or expired';
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = exception.message;
      }
    }

    console.error(`[${request.method}] ${request.url} - Status: ${status} - Message: ${message}`, exception);

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
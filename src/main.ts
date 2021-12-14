import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions : {
        enableImplicitConversion: true
    }
  }));

  // Setting up Swagger document
  const options = new DocumentBuilder()
  .setTitle('Iluvcoffee')
  .setDescription('Coffee application')
  .setVersion('1.0')
  .build()

  //create all route in the app
  const document = SwaggerModule.createDocument(app, options);
  //1.- route path to amount the swagger UI
  //2.- our application instance
  //3.- document object
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor())
  await app.listen(3000);
}
bootstrap();

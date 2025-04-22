import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  
  const logger = new Logger();
  

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true
  }))

  app.listen(process.env.PORT ?? 3000);
  logger.log(`App running on port ${process.env.PORT }`)
}
bootstrap();

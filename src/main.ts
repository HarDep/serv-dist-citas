import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let configService = app.get(ConfigService);

  const port = configService.get('config.port');

  const clientHost = configService.get('config.clientHost');

  app.enableCors({
    origin: `http://${clientHost}:4200`,
  });

  await app.listen(port);

  console.log(`Server running on port ${port}`);
}
bootstrap();

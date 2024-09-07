import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let configService = app.get(ConfigService);

  const port = configService.get('config.port');

  const clientHost = configService.get('config.clientHost');

  const clientPort = configService.get('config.clientPort');

  app.enableCors({
    origin: `http://${clientHost}:${clientPort}`,
  });

  await app.listen(port);

  console.log(`Server running on port ${port}`);
}
bootstrap();

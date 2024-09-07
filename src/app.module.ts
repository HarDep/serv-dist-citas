import { Module } from '@nestjs/common';
import { ConsultationsModule } from './consultations/consultations.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Module({
  imports: [ConsultationsModule, ConfigModule.forRoot({
    envFilePath: './.env',
    load: [config],
    isGlobal: true
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}

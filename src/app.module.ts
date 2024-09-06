import { Module } from '@nestjs/common';
import { ConsultationsModule } from './consultations/consultations.module';

@Module({
  imports: [ConsultationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

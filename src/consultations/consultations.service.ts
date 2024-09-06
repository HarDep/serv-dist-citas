import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsultationsService {
  create(cc: string, date: Date, authorizationFile: string) {
    return `This action create a consultations ${cc} ${date} ${authorizationFile}`;
  }

  findAll(minDate: Date, maxDate: Date) {
    return `This action returns all consultations from ${minDate} to ${maxDate}`;
  }

  findOne(cc: string, minDate: Date, maxDate: Date) {
    return `This action returns a #${cc} consultation from ${minDate} to ${maxDate}`;
  }

  update(consultationCode: string) {
    return `This action updates a #${consultationCode} consultation`;
  }

  exists(cc: string, date: Date) {
    return false;
  }
}

import { Injectable } from '@nestjs/common';
import { Consultation } from './entities/consultation.entity';
import { GetConsultationDto } from './dto/get-consultation.dto';

@Injectable()
export class ConsultationsService {

  private consultations: Consultation[] = [];

  create(cc: string, date: Date, authorizationFileName: string) {
    const consultationCode = `${cc}-${date.getTime()}`;
    this.consultations.push({
      cc: cc, 
      consultationCode: consultationCode, 
      consultationDate: date, 
      authorizationFileName: authorizationFileName, 
      isCancelled: false
    });
      return consultationCode;
  }

  findAll(minDate: Date, maxDate: Date) {
    let newlist = this.consultations.filter(consultation => (consultation.consultationDate >= minDate) && 
      (consultation.consultationDate <= maxDate));
    let list = newlist.map(consultation => {
      const dto = new GetConsultationDto();
      dto.cc = consultation.cc;
      dto.consultationCode = consultation.consultationCode;
      dto.consultationDate = consultation.consultationDate;
      dto.isCancelled = consultation.isCancelled;
      return dto;
    });
    return list;
  }

  findAllByCC(cc: string, minDate: Date, maxDate: Date) {
    let newlist = this.consultations.filter(consultation => (consultation.cc === cc) && 
      (consultation.consultationDate >= minDate) && (consultation.consultationDate <= maxDate));
    let list = newlist.map(consultation => {
      const dto = new GetConsultationDto();
      dto.cc = consultation.cc;
      dto.consultationCode = consultation.consultationCode;
      dto.consultationDate = consultation.consultationDate;
      dto.isCancelled = consultation.isCancelled;
      return dto;
    });
    return list;
  }

  update(consultationCode: string) {
    let consultation = this.consultations.find(consultation => 
      consultation.consultationCode === consultationCode);
    consultation.isCancelled = true;
    let dto = new GetConsultationDto();
    dto.cc = consultation.cc;
    dto.consultationCode = consultation.consultationCode;
    dto.consultationDate = consultation.consultationDate;
    dto.isCancelled = consultation.isCancelled;
    return dto;
  }

  exists(cc: string, date: Date) {
    let consultation = this.consultations.find(consultation => 
      (consultation.cc === cc) && (consultation.consultationDate === date));
    return consultation !== undefined && consultation !== null;
  }
}

import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<Date> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    if (isNaN(Date.parse(value))) {
      throw new HttpException('Fecha invalida', HttpStatus.BAD_REQUEST);
    }
    return new Date(value);
  }
}


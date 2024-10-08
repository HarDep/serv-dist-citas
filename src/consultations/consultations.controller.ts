import { Controller, Get, Post, Patch, Param, HttpCode, Query, HttpStatus, UseInterceptors, HttpException, UploadedFile, StreamableFile } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ParseDatePipe } from './parse-date/parse-date.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { diskStorage } from 'multer';
import { createReadStream, existsSync } from 'fs';

const MESSAGE_ERROR_FIELDS = 'Cedula de ciudadania, imagen de autorizacion y fecha son requeridos'

const FILE_UPLOAD_DIR = join(process.cwd(), 'uploads');

const authorizationNameGenerator = (req, file, callback) => {
  const cc = req.query.cc;
  const date = req.query.date;
  const splited = file.originalname.split('.');
  const extension = splited[splited.length - 1];
  const fileName = `${cc}-${date}.${extension}`;
  callback(null, fileName);
};

const authorizationFilter = (req, file, callback) => {
  const cc = req.query.cc;
  const date = req.query.date;
  const splited = file.originalname.split('.');
  const extension = splited[splited.length - 1];
  const isValid = file.originalname.match(/\.(jpg|jpeg|png)$/);
  if(!cc || !date) return callback(new HttpException(MESSAGE_ERROR_FIELDS, HttpStatus.BAD_REQUEST), false);
  if(existsSync(join(FILE_UPLOAD_DIR, `${cc}-${date}.${extension}`))) return callback(
    new HttpException('Ya existe una consulta para esa persona en esa fecha', HttpStatus.BAD_REQUEST), false);
  callback(isValid? null: new HttpException('Solo se permiten imagenes (png, jpg, jpeg)', 
    HttpStatus.BAD_REQUEST), isValid);
};

@Controller('api/v1/consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors( FileInterceptor('file', {
    storage: diskStorage({
      destination: FILE_UPLOAD_DIR,
      filename: authorizationNameGenerator,
    }),
    limits: {
      fileSize: 20000000,
    },
    fileFilter: authorizationFilter,
  }))
  create(@UploadedFile() file: Express.Multer.File, @Query('cc') cc: string, 
      @Query('date', ParseDatePipe) consultationDate: Date) {
    if(!cc || !consultationDate || !file) throw new HttpException(MESSAGE_ERROR_FIELDS, 
      HttpStatus.BAD_REQUEST);
    if(this.consultationsService.exists(cc, consultationDate)) {
      throw new HttpException('Ya existe una consulta para esa persona en esa fecha', 
        HttpStatus.BAD_REQUEST);
    }

    const code = this.consultationsService.create(cc, consultationDate, file.filename);
  
    return { consultationCode: code };
  }

  @Get(':cc')
  @HttpCode(HttpStatus.OK)
  findAllByCC(@Param('cc') cc: string, @Query('minDate', ParseDatePipe) minDate: Date,
      @Query('maxDate', ParseDatePipe) maxDate: Date) {
    if(!maxDate||!minDate) throw new HttpException('La fechas son requeridas',HttpStatus.BAD_REQUEST);
    if(maxDate<minDate||maxDate==minDate) throw new HttpException('La fecha maxima debe ser mayor que la fecha minima',HttpStatus.BAD_REQUEST);
    if(!this.consultationsService.existsCC(cc))throw new HttpException('La cedula no existe', HttpStatus.BAD_REQUEST);

    return this.consultationsService.findAllByCC(cc, minDate, maxDate);
  }

  @Get('authorizations/:consultationCode')
  @HttpCode(HttpStatus.OK)
  findConsultationAuthorization(@Param('consultationCode') consultationCode: string) {
    if(!this.consultationsService.existConsultation(consultationCode)) throw new
    HttpException('La Consulta No Existe',HttpStatus.BAD_REQUEST);
    const filename = this.consultationsService.findFileName(consultationCode);

    const splited = filename.split('.');
    const extension = splited[splited.length - 1];
    const file = createReadStream(join(FILE_UPLOAD_DIR, filename));
    return new StreamableFile(file, {
      type: `image/${extension}`,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query('minDate', ParseDatePipe) minDate: Date, 
      @Query('maxDate', ParseDatePipe) maxDate: Date) {
    if(!maxDate||!minDate) throw new HttpException('La fecha no existe',HttpStatus.BAD_REQUEST);
    if(maxDate<minDate||maxDate==minDate) throw new HttpException('La fecha maxima debe ser mayor que la fecha minima',HttpStatus.BAD_REQUEST);
    
    return this.consultationsService.findAll(minDate, maxDate);
  }

  @Patch(':consultationCode')
  @HttpCode(HttpStatus.OK)
  update(@Param('consultationCode') consultationCode: string) {
    if(!this.consultationsService.existConsultation(consultationCode)) throw new
    HttpException('La Consulta No Existe',HttpStatus.BAD_REQUEST);

    return this.consultationsService.update(consultationCode);
  }
}

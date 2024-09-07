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

  //crear una consulta -> ulr: /api/v1/consultations?cc=123&date=2020-01-01
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors( FileInterceptor('file', {
    storage: diskStorage({
      destination: FILE_UPLOAD_DIR,
      filename: authorizationNameGenerator,
    }),
    limits: {
      fileSize: 20000000,//20MB
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

  //obtener todas las consultas entre dos fechas para una persona con cc
  //-> url: /api/v1/consultations/{cc}?minDate=2020-01-01&maxDate=2020-01-02  los {} no se ponen
  @Get(':cc')
  @HttpCode(HttpStatus.OK)
  findAllByCC(@Param('cc') cc: string, @Query('minDate', ParseDatePipe) minDate: Date,
    @Query('maxDate', ParseDatePipe) maxDate: Date) {
    //TODO: validar que las fechas existan

    //TODO: validar que fecha minima sea menor o igual a la fecha maxima

    //TODO: validar que la cc exista

    //TODO: obtener datos de la consulta

    //TODO: retornar el los datos de arreglo
    return this.consultationsService.findAllByCC(cc, minDate, maxDate);
  }

  //obtener la imagen de la autorizacion de una consulta
  //-> url: /api/v1/consultations/authorizations/{consultationCode}  los {} no se ponen
  @Get('authorizations/:consultationCode')
  @HttpCode(HttpStatus.OK)
  findConsultationAuthorization(@Param('consultationCode') consultationCode: string) {
    //TODO: validar que la consulta exista

    //TODO: obtener datos de el nombre de la imagen de la autorizacion de la consulta
    const filename = '';

    //TODO: retornar el archivo de la autorizacion
    const file = createReadStream(join(FILE_UPLOAD_DIR, filename));
    return new StreamableFile(file);
  }

  //obtener todas las consultas entre dos fechas
  //-> url: /api/v1/consultations?minDate=2020-01-01&maxDate=2020-01-02
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query('minDate', ParseDatePipe) minDate: Date, 
    @Query('maxDate', ParseDatePipe) maxDate: Date) {
    //TODO: validar que las fechas existan

    //TODO: validar que fecha minima sea menor o igual a la fecha maxima

    //TODO: obtener datos de la consulta

    //TODO: retornar el los datos de arrglo
    return this.consultationsService.findAll(minDate, maxDate);
  }

  //cancelar la consulta -> url: /api/v1/consultations/{consultationCode} los {} no se ponen
  @Patch(':consultationCode')
  @HttpCode(HttpStatus.OK)
  update(@Param('consultationCode') consultationCode: string) {
    //TODO: validar que la consulta exista

    //TODO: actualizar la consulta

    //TODO: retornar el los datos actualizados
    return this.consultationsService.update(consultationCode);
  }
}

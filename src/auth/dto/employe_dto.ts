import { IntersectionType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidationArguments,
} from 'class-validator';
import { Update_Private_User, Update_Public_User, User } from './user_dto';

export class Employe {
  @IsString({
    message: 'La hora de entrada debe ser un valor de tipo string',
  })
  entry_time: string;

  @IsString({
    message: 'La hora de salida debe ser un valor de tipo string',
  })
  departure_time: string;

  @IsString({
    message: 'El campo de dias de trabajo debe ser un valor de tipo string',
  })
  @Length(8, 25, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El campo de dias de trabajo es requerida.';
      else if (arg.value.length <= 7)
        return 'El campo de dias de trabajo debe contener al menos 8 caracteres.';
      else
        return 'El campo de dias de trabajo debe contener por lo mucho 25 caracteres';
    },
  })
  days_to_work: string;

  @IsOptional()
  @IsString({
    message: 'Las observaciones deben ser un valor de tipo string',
  })
  observations?: string;

  @IsNumber(undefined, {
    message: 'El trabajo del empleado no se selecciono adecuadamente',
  })
  @IsInt({
    message: 'El trabajo del empleado no se selecciono adecuadamente',
  })
  job: number;
}

export class Employe_DTO extends IntersectionType(User, Employe) {}

export class Update_Public_Employe extends Update_Public_User {}

export class Update_Private_Employe extends IntersectionType(
  Update_Private_User,
  Employe,
) {
  @IsNumber(undefined, {
    message: 'El status del empleado no se selecciono adecuadamente',
  })
  @IsInt({
    message: 'El status del empleado no se selecciono adecuadamente',
  })
  status_employe: number;
}

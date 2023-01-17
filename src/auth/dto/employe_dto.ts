import {
  IsInt,
  IsNumber,
  IsString,
  Length,
  ValidationArguments,
} from 'class-validator';
import { User } from './user_dto';

export default class Employe extends User {
  @IsString({
    message: 'La hora de entrada debe ser un valor de tipo string',
  })
  readonly entry_time: string;

  @IsString({
    message: 'La hora de salida debe ser un valor de tipo string',
  })
  readonly departure_time: string;

  @IsString({
    message: 'El campo de dias de trabajo debe ser un valor de tipo string',
  })
  @Length(8, 25, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El campo de dias de trabajo es requerida.';
      else if (arg.value.length <= 4)
        return 'El campo de dias de trabajo debe contener al menos 4 caracteres.';
      else
        return 'El campo de dias de trabajo debe contener por lo mucho 25 caracteres';
    },
  })
  readonly days_to_work: string;

  @IsString({
    message: 'Las observaciones deben ser un valor de tipo string',
  })
  readonly observations?: string;

  @IsNumber(undefined, {
    message: 'El tipo del empleado no se selecciono adecuadamente',
  })
  @IsInt({
    message: 'El tipo del empleado no se selecciono adecuadamente',
  })
  readonly type_employe: number;

  @IsNumber(undefined, {
    message: 'El trabajo del empleado no se selecciono adecuadamente',
  })
  @IsInt({
    message: 'El trabajo del empleado no se selecciono adecuadamente',
  })
  readonly job: number;
}

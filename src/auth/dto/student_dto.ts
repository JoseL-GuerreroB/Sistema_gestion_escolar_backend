import { IntersectionType, OmitType, PickType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidationArguments,
} from 'class-validator';
import { User } from './user_dto';

export class Student {
  @IsString({
    message: 'El nombre del tutor debe ser un valor de tipo string',
  })
  @Length(8, 100, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El nombre del tutor es requerido.';
      else if (arg.value.length <= 7)
        return 'El nombre del tutor debe contener al menos 8 caracteres.';
      else
        return 'El nombre del tutor debe contener por lo mucho 100 caracteres';
    },
  })
  tutor: string;

  @IsString({
    message: 'El telefono del tutor debe ser un valor de tipo string',
  })
  @Length(10, 10, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El telefono del tutor es requerido.';
      else return 'El telefono del usuario debe contener 10 caracteres.';
    },
  })
  tutor_phone: string;

  @IsOptional()
  @IsNumber(undefined, {
    message: 'El grado y grupo no se selecciono adecuadamente',
  })
  @IsInt({
    message: 'El grado y grupo no se selecciono adecuadamente',
  })
  grade_and_group?: number;
}

export class Create_Student_DTO extends IntersectionType(User, Student) {}

export class Update_Public_Data_Student_DTO extends PickType(User, [
  'username',
  'phone',
] as const) {}

export class Update_Private_Data_Student_DTO extends OmitType(
  Create_Student_DTO,
  ['password'] as const,
) {
  @IsNumber(undefined, {
    message: 'El status del estudiante no se selecciono adecuadamente',
  })
  @IsInt({
    message: 'El status del estudiante no se selecciono adecuadamente',
  })
  status_student: number;
}

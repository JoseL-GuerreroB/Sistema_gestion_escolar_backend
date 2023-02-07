import { IntersectionType } from '@nestjs/mapped-types';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
  ValidationArguments,
} from 'class-validator';
import {
  Employe_DTO,
  Update_Private_Employe,
  Update_Public_Employe,
} from './employe_dto';

export class Teacher {
  @IsString({
    message: 'La especialidad debe ser un valor de tipo string',
  })
  @Length(8, 100, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'La especialidad es requerida.';
      else if (arg.value.length <= 4)
        return 'La especialidad debe contener al menos 8 caracteres.';
      else return 'La especialidad debe contener por lo mucho 100 caracteres';
    },
  })
  speciality: string;

  @IsString({
    message: 'El cubiculo debe ser un valor de tipo string',
  })
  @Length(2, 20, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El cubiculo es requerida.';
      else if (arg.value.length <= 1)
        return 'El cubiculo debe contener al menos 2 caracteres.';
      else return 'El cubiculo debe contener por lo mucho 20 caracteres';
    },
  })
  cubicle: string;
}

export class Create_Teacher_DTO extends IntersectionType(
  Employe_DTO,
  Teacher,
) {}

export class Update_Public_Teacher {
  @IsOptional()
  @IsString({
    message: 'La presentacion debe ser un valor de tipo string',
  })
  @Length(8, 100, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'La presentacion es requerida.';
      else if (arg.value.length <= 7)
        return 'La presentacion debe contener al menos 8 caracteres.';
      else return 'La presentacion debe contener por lo mucho 100 caracteres';
    },
  })
  presentation?: string;
}

export class Update_Private_Teacher extends IntersectionType(
  Update_Public_Teacher,
  Teacher,
) {
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'El porcentaje debe ser un numero con un maximo de 2 decimales.',
    },
  )
  @IsPositive({
    message: 'El valor del porcentaje debe ser positivo.',
  })
  @Min(0, {
    message: 'El porcentaje minimo es 0',
  })
  @Max(100, {
    message: 'El porcentaje maximo es 100',
  })
  pass_rate: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'El porcentaje debe ser un numero con un maximo de 2 decimales.',
    },
  )
  @IsPositive({
    message: 'El valor del porcentaje debe ser positivo.',
  })
  @Min(0, {
    message: 'El porcentaje minimo es 0',
  })
  @Max(100, {
    message: 'El porcentaje maximo es 100',
  })
  failure_rate: number;
}

export class Update_Public_Data_Teacher_DTO extends IntersectionType(
  Update_Public_Employe,
  Update_Public_Teacher,
) {}

export class Update_Private_Data_Teacher_DTO extends IntersectionType(
  Update_Private_Employe,
  Update_Private_Teacher,
) {}

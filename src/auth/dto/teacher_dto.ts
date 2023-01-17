import { OmitType, PickType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsString,
  Length,
  ValidationArguments,
} from 'class-validator';
import Employe from './employe_dto';

export class Create_Teacher_DTO extends Employe {
  @IsString({
    message: 'La especialidad debe ser un valor de tipo string',
  })
  @Length(8, 25, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'La especialidad es requerida.';
      else if (arg.value.length <= 4)
        return 'La especialidad debe contener al menos 4 caracteres.';
      else return 'La especialidad debe contener por lo mucho 100 caracteres';
    },
  })
  speciality: string;
}

export class Update_Public_Data_Teacher_DTO extends PickType(
  Create_Teacher_DTO,
  ['username', 'phone', 'speciality'] as const,
) {
  @IsString({
    message: 'La presentacion debe ser un valor de tipo string',
  })
  @Length(8, 25, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'La presentacion es requerida.';
      else if (arg.value.length <= 4)
        return 'La presentacion debe contener al menos 4 caracteres.';
      else return 'La presentacion debe contener por lo mucho 100 caracteres';
    },
  })
  presentation?: string;
}

export class Update_Private_Data_Teacher_DTO extends OmitType(
  Create_Teacher_DTO,
  ['password'] as const,
) {
  @IsOptional()
  @IsString({
    message: 'La presentacion debe ser un valor de tipo string',
  })
  @Length(8, 25, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'La presentacion es requerida.';
      else if (arg.value.length <= 4)
        return 'La presentacion debe contener al menos 4 caracteres.';
      else return 'La presentacion debe contener por lo mucho 100 caracteres';
    },
  })
  presentation?: string;
}

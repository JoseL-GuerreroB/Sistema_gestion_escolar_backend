import { IntersectionType } from '@nestjs/mapped-types';
import { IsInt, IsNumber, Length, ValidationArguments } from 'class-validator';
import {
  Employe_DTO,
  Update_Private_Employe,
  Update_Public_Employe,
} from './employe_dto';

export class Administrator {
  @Length(2, 15, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El area es requerida.';
      else if (arg.value.length <= 1)
        return 'El area debe contener al menos 2 caracteres.';
      else return 'El area debe contener por lo mucho 15 caracteres';
    },
  })
  area: string;

  @IsNumber(undefined, {
    message: 'El tipo de administrador no se selecciono adecuadamente',
  })
  @IsInt({
    message: 'El tipo de administrador no se selecciono adecuadamente',
  })
  type_administrator: number;
}

export class Create_Admin_DTO extends IntersectionType(
  Employe_DTO,
  Administrator,
) {}

export class Update_Public_Data_Admin_DTO extends Update_Public_Employe {}

export class Update_Private_Data_Admin_DTO extends IntersectionType(
  Update_Private_Employe,
  Administrator,
) {}

import { IntersectionType } from '@nestjs/mapped-types';
import { IsInt, IsNumber, Max, Min } from 'class-validator';
import {
  Employe_DTO,
  Update_Private_Employe,
  Update_Public_Employe,
} from './employe_dto';

export class SuperAdministrator {
  @IsNumber(undefined, {
    message: 'La posición no se selecciono adecuadamente',
  })
  @IsInt({
    message: 'La posición no se selecciono adecuadamente',
  })
  @Min(1, {
    message: 'La posición no se selecciono adecuadamente',
  })
  @Max(6, {
    message: 'Ya has alcanzado el limite de super administradores',
  })
  position: number;
}

export class Create_SuperAdministrator_DTO extends IntersectionType(
  Employe_DTO,
  SuperAdministrator,
) {}

export class Update_Public_Data_SuperAdmin_DTO extends Update_Public_Employe {}

export class Update_Private_Data_SuperAdmin_DTO extends IntersectionType(
  Update_Private_Employe,
  SuperAdministrator,
) {}

import { IsString, Length } from 'class-validator';
import { User } from './user_dto';

export class Create_SuperUser_DTO extends User {
  @IsString({
    message: 'El titulo más alto debe ser un string',
  })
  @Length(8, 50, {
    message: 'El titulo más alto debe tener este rango de caracteres (8 - 50)',
  })
  high_level_title: string;
}

export class Update_SuperUser_DTO extends Create_SuperUser_DTO {}

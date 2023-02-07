import { OmitType, PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsStrongPassword,
  Length,
  Max,
  Min,
  ValidationArguments,
} from 'class-validator';
import { HasCharacters } from 'decorators/HasCharacters';

export class User {
  @IsString({
    message: 'El username debe ser un string',
  })
  @Length(3, 20, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El username es requerido.';
      else if (arg.value.length <= 2)
        return 'El username debe contener al menos 3 caracteres.';
      else return 'El username debe contener por lo mucho 20 caracteres';
    },
  })
  @HasCharacters({
    message: (arg: ValidationArguments) => {
      if (isNaN(arg.value) === false)
        return 'El username debe contener caracteres';
      else
        return 'El username no debe tener numeros ni caracteres especiales al principio de la cadena';
    },
  })
  username: string;

  @IsString({
    message: 'El nombre del usuario debe ser un string',
  })
  @Length(3, 30, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El nombre del usuario es requerido.';
      else if (arg.value.length <= 2)
        return 'El nombre del usuario debe contener al menos 3 caracteres.';
      else
        return 'El nombre del usuario debe contener por lo mucho 30 caracteres';
    },
  })
  first_name: string;

  @IsString({
    message: 'Los apellidos del usuario deben ser un string',
  })
  @Length(4, 30, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'Los apellidos del usuario son requeridos.';
      else if (arg.value.length <= 3)
        return 'Los apellidos del usuario deben contener al menos 4 caracteres.';
      else
        return 'Los apellidos del usuario deben contener por lo mucho 30 caracteres';
    },
  })
  last_name: string;

  // Crear un validador para fechas
  @IsString({
    message: 'La fecha de nacimiento debe ser una fecha valida',
  })
  date_of_birth: string;

  @IsNumber(undefined, {
    message: 'La edad debe ser un valor numerico',
  })
  @IsInt({
    message: 'La edad debe ser un valor entero',
  })
  @IsPositive({
    message: 'La edad debe ser un valor positivo',
  })
  @Min(14, {
    message: 'La edad minima para ingresar es de 14 años',
  })
  @Max(120, {
    message: 'La edad maxima para ingresar es de 120 años',
  })
  age: number;

  @IsString({
    message: 'La dirección del usuario deben ser un string',
  })
  @Length(4, 30, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'La dirección del usuario es requerida.';
      else if (arg.value.length <= 3)
        return 'La dirección del usuario deben contener al menos 4 caracteres.';
      else
        return 'La dirección del usuario deben contener por lo mucho 30 caracteres';
    },
  })
  address: string;

  @IsIn(['No especificado', 'Masculino', 'Femenino'], {
    message: 'No seleccionaste un genero permitido.',
  })
  gender: string;

  @IsString({
    message: 'La nacionalidad del usuario debe ser un string',
  })
  @Length(4, 30, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'La nacionalidad del usuario es requerida.';
      else if (arg.value.length <= 3)
        return 'La nacionalidad del usuario debe contener al menos 4 caracteres.';
      else
        return 'La nacionalidad del usuario deben contener por lo mucho 20 caracteres';
    },
  })
  nationality: string;

  @IsOptional()
  @IsString({
    message: 'El telefono del usuario debe ser un valor de tipo string',
  })
  @Length(10, 10, {
    message: 'El telefono del usuario debe contener 10 caracteres.',
  })
  phone?: string;

  @IsEmail(undefined, {
    message: 'El formato del correo electronico no es correcto',
  })
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'La contraseña debe tener 8 caracteres como minimo, un numero, una letra en mayuscula y un simbolo.',
    },
  )
  password: string;
}

export class Update_Public_User extends PickType(User, [
  'username',
  'phone',
] as const) {}

export class Update_Private_User extends OmitType(User, [
  'password',
] as const) {}

// ------------------- Auth User -----------------

export class Login_DTO extends PickType(User, ['email', 'password']) {}

export class Preform_Password_Recovery_DTO extends PickType(User, [
  'username',
  'email',
  'phone',
] as const) {}

export class Form_Password_Recovery_DTO extends PickType(User, [
  'password',
] as const) {}

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint()
export class HasCharactersConstraint implements ValidatorConstraintInterface {
  validate(strValue: any, args: ValidationArguments) {
    console.log(args);
    const expReg = {
      expRegFirstLetter: /^[a-zA-zÀ-ÿñÑ]+(\S|\s{1}\S+)*$/g,
    };
    if (expReg.expRegFirstLetter.test(strValue) === false) return false;
    return true;
  }
}

export function HasCharacters(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: HasCharactersConstraint,
    });
  };
}

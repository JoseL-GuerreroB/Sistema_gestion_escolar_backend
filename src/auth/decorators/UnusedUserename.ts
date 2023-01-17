import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { AuthDecorators } from '../auth.decorator';

@ValidatorConstraint({ async: true })
export class UnusedUsernameConstraint implements ValidatorConstraintInterface {
  constructor(private readonly authDecorator: AuthDecorators) {}
  validate(userName: string, args: ValidationArguments) {
    console.log(args);
    console.log(this.authDecorator);
    return this.authDecorator
      .Unused_Username_Decorators(userName)
      .then((user) => {
        if (user) return false;
        return true;
      });
    console.log(userName);
    // return false;
  }
}

export function UnusedUsername(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UnusedUsernameConstraint,
    });
  };
}

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PasswordTokenGuard extends AuthGuard('jwt-pass') {}

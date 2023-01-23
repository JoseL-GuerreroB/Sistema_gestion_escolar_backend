import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

import {
  Form_Password_Recovery_DTO,
  Login_DTO,
  Preform_Password_Recovery_DTO,
} from '../dto/user_dto';

import AuthPreservice from '../services/auth_pre.service';
import AuthStudentService from '../services/auth_student.service';

@Controller('app')
export default class SesionsController {
  constructor(
    private readonly authPreservice: AuthPreservice,
    private readonly authStudentService: AuthStudentService,
  ) {}

  @Get('pre_sesion')
  @UseGuards(AuthGuard('jwt-refresh'))
  async Pre_Sesion(@Req() req: Request) {
    const userEntity = req.user;
    try {
      const accessToken = await this.authPreservice.generateToken(
        userEntity['id'],
        userEntity['secondLevel'],
        userEntity['thirdLevel'],
      );
      return { ok: true, accessToken };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('sesion')
  @UseGuards(AuthGuard('jwt'))
  async Sesion(@Req() req: Request) {
    const user = req.user;
    try {
      const arbol = {
        Estudiante: await this.authStudentService.Sesion_Student_With_Jwt(
          user['id'],
        ),
      };
      let userEntity: object;
      console.log(user['thirdLevel']);
      if (user['thirdLevel']) {
        if (Object.keys(arbol).includes(user['thirdLevel']))
          userEntity = arbol[`${user['thirdLevel']}`];
        else
          throw new HttpException(
            'Error del servidor.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      } else {
        if (Object.keys(arbol).includes(user['secondLevel']))
          userEntity = arbol[`${user['secondLevel']}`];
        else
          throw new HttpException(
            'Error del servidor.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
      return { ok: true, userEntity };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('close_sesion')
  @UseGuards(AuthGuard('jwt'))
  Logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token');
    return { ok: true, message: 'Sesion terminada' };
  }

  @Post('login/:type')
  async Login(
    @Param('type') type: string,
    @Body() dataLogin: Login_DTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    let userEntity: any;
    const dataLevels = [];
    try {
      if (type === 'Estudiante') {
        userEntity = await this.authStudentService.Login_Student(dataLogin);
      } else
        throw new HttpException(
          'funcionalidad no implementada',
          HttpStatus.HTTP_VERSION_NOT_SUPPORTED,
        );
      dataLevels[0] = userEntity.id;
      dataLevels[1] = userEntity.user
        ? userEntity.user.type_user.type_user
        : userEntity.employe.user.type_user.type_user;
      dataLevels[2] = userEntity.employe
        ? userEntity.employe.user.type_user.type_user
        : null;
      await this.authPreservice.generateRefreshToken(
        dataLevels[0],
        dataLevels[1],
        dataLevels[2],
        res,
      );
      const accessToken = await this.authPreservice.generateToken(
        dataLevels[0],
        dataLevels[1],
        dataLevels[2],
      );
      return { accessToken, userEntity };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('validate_identity')
  async Validate_Identity(@Body() data: Preform_Password_Recovery_DTO) {
    try {
      const user = await this.authPreservice.Find_User_for_Change_Password(
        data.username,
        data.email,
        data.phone,
      );
      const passwordToken = await this.authPreservice.generateTokenPassword(
        user.id,
      );
      return { ok: true, passwordToken };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('change_password')
  @UseGuards(AuthGuard('jwt-pass'))
  async Change_Password(
    @Req() req: Request,
    @Body() data: Form_Password_Recovery_DTO,
  ) {
    try {
      await this.authPreservice.Change_Password(req.user['id'], data.password);
      return { ok: true, message: 'Tu contraseña ha sido cambiada' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

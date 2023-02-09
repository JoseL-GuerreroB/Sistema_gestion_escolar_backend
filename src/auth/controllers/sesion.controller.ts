import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request, Response } from 'express';

import {
  Form_Password_Recovery_DTO,
  Login_DTO,
  Preform_Password_Recovery_DTO,
} from '../dto/user_dto';
import { keySesionType } from '../helpers/capture_key';
import EmployeService from '../services/employe.service';

import StudentService from '../services/student.service';
import TeacherService from '../services/teacher.service';
import TokenService from '../services/token.service';
import UserService from '../services/user.service';

@Controller('app')
export default class SesionsController {
  constructor(
    private readonly userService: UserService,
    private readonly studentService: StudentService,
    private readonly employeService: EmployeService,
    private readonly teacherService: TeacherService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('pre_sesion')
  @UseGuards(AuthGuard('jwt-refresh'))
  async Pre_Sesion(@Req() req: Request) {
    const userEntity = req.user;
    try {
      const accessToken = await this.tokenService.generateToken(
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
      const typeSesion = {
        Estudiante: async (userid: any) =>
          await this.studentService.Sesion_Student_With_Jwt(userid),
        Maestro: async (userid: any) =>
          await this.teacherService.Sesion_Teacher_With_Jwt(userid),
      };
      let userEntity: object;
      if (Object.keys(typeSesion).includes(user['secondLevel']))
        userEntity = typeSesion[`${user['secondLevel']}`](user['id']);
      else if (Object.keys(typeSesion).includes(user['thirdLevel']))
        userEntity = typeSesion[`${user['thirdLevel']}`](user['id']);
      else
        throw new HttpException(
          'Error del servidor.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      return userEntity;
    } catch (error) {
      console.log(error);
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
    @Body() data: Login_DTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    let userEntity: any;
    const dataLevels = [];
    try {
      const user = await this.userService.User_Login(data.email, data.password);
      switch (type) {
        case 'Estudiante':
          userEntity = await this.studentService.Login_Student(user);
          break;
        case 'Maestro':
          const employe = await this.employeService.Find_Employe_For_Login(
            user,
          );
          userEntity = await this.teacherService.Login_Teacher(employe);
          break;
        default:
          throw new HttpException(
            'funcionalidad no implementada',
            HttpStatus.HTTP_VERSION_NOT_SUPPORTED,
          );
      }
      dataLevels[0] = userEntity.id;
      dataLevels[1] = userEntity.user
        ? userEntity.user.type_user.type_user
        : userEntity.employe.user.type_user.type_user;
      dataLevels[2] = userEntity.employe
        ? userEntity.employe.type_employe.type_employe
        : null;
      await this.tokenService.generateRefreshToken(
        dataLevels[0],
        dataLevels[1],
        dataLevels[2],
        res,
      );
      return { ok: true };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('validate_identity')
  @UseGuards(AuthGuard('jwt'))
  async Validate_Identity(@Body() data: Preform_Password_Recovery_DTO) {
    try {
      const user = await this.userService.Find_User_for_Change_Password(
        data.username,
        data.email,
        data.phone,
      );
      const passwordToken = await this.tokenService.generateTokenPassword(
        user.id,
      );
      return passwordToken;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch('change_password')
  @UseGuards(AuthGuard('jwt-pass'))
  async Change_Password(
    @Req() req: Request,
    @Body() data: Form_Password_Recovery_DTO,
  ) {
    try {
      await this.userService.Change_Password(req.user['id'], data.password);
      return { ok: true, message: 'Tu contraseña ha sido cambiada' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch('change_foto')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo'))
  async Change_Foto(
    @Req() req: Request,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    const user = req.user;
    try {
      const typeSesion = {
        Estudiante: async (userid: any) =>
          await this.studentService.Sesion_Student_With_Jwt(userid),
        Maestro: async (userid: any) =>
          await this.teacherService.Sesion_Teacher_With_Jwt(userid),
      };
      let userEntity: any;
      if (Object.keys(typeSesion).includes(user['secondLevel']))
        userEntity = typeSesion[`${user['secondLevel']}`](user['id']);
      else if (Object.keys(typeSesion).includes(user['thirdLevel']))
        userEntity = typeSesion[`${user['thirdLevel']}`](user['id']);
      else
        throw new HttpException(
          'Error del servidor.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      const sesion = keySesionType[`${user['secondLevel']}`];
      const idUser = userEntity.user
        ? userEntity.user.id
        : userEntity[sesion].user.id;
      await this.userService.Update_User_Service(idUser, {
        photo: photo.buffer.toString(),
      });
      // data:image/jpeg;base64, in HTML
      return { ok: true };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }
}

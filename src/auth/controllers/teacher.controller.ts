import {
  Body,
  Controller,
  Delete,
  HttpException,
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
  Create_Teacher_DTO,
  Update_Private_Data_Teacher_DTO,
  Update_Public_Data_Teacher_DTO,
} from '../dto/teacher_dto';
import { keysEmployeData, keysTeacherData } from '../helpers/capture_key';
import { Roles } from '../helpers/roles/role.decorator';
import { RolesGuard } from '../helpers/roles/role.guard';
import EmployeService from '../services/employe.service';
import TeacherService from '../services/teacher.service';
import UserService from '../services/user.service';

@Controller('auth_teacher')
export default class TeacherController {
  constructor(
    private readonly userService: UserService,
    private readonly employeService: EmployeService,
    private readonly teacherService: TeacherService,
  ) {}

  @Post('register')
  @Roles('Administrador de maestros')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Register_Teacher(@Body() data: Create_Teacher_DTO) {
    try {
      const dataUser = {};
      const dataEmploye = {};
      const dataTeacher = {};
      Object.entries(data).forEach(([key, values]) => {
        if (!keysEmployeData.includes(key) && !keysTeacherData.includes(key))
          dataUser[key] = values;
        else if (!keysTeacherData.includes(key)) dataEmploye[key] = values;
        else dataTeacher[key] = values;
      });
      const user = await this.userService.Create_User_Service(dataUser, 2);
      const employe = await this.employeService.Create_Employe_Service(
        user,
        dataEmploye,
      );
      await this.teacherService.Create_Teacher_Service(employe, dataTeacher);
      return { ok: true };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('public_update')
  @Roles('Maestro')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Public_Update_Teacher(
    @Body() data: Update_Public_Data_Teacher_DTO,
    @Req() req: Request,
  ) {
    const user = req.user;
    try {
      const teacher = await this.teacherService.Sesion_Teacher_With_Jwt(
        user['id'],
      );
      const newUsername = await this.userService.UniqueStringValidatorFromUser(
        teacher.employe.user.id,
        'username',
        data.username,
      );
      if (newUsername === false) data.username === undefined;
      const newDataTeacher = data;
      const { propsUser, propsEmploye, propsTeacher } =
        this.teacherService.Teacher_Data_Separation(newDataTeacher);
      await this.userService.Update_User_Service(
        teacher.employe.user.id,
        propsUser,
      );
      if (Object.values(propsEmploye).length > 0)
        await this.employeService.Update_Employe_Service(
          teacher.employe.id,
          propsEmploye,
        );
      if (Object.values(propsTeacher).length > 0)
        await this.teacherService.Update_Teacher_Service(
          teacher.id,
          propsTeacher,
        );
      return await this.teacherService.Sesion_Teacher_With_Jwt(teacher.id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('private_update/:id')
  @Roles('Administrador de maestros')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Private_Update_Teacher(
    @Body() data: Update_Private_Data_Teacher_DTO,
    @Param('id') id: number,
  ) {
    try {
      const teacher = await this.teacherService.Sesion_Teacher_With_Jwt(id);
      const newUsername = await this.userService.UniqueStringValidatorFromUser(
        teacher.employe.user.id,
        'username',
        data.username,
      );
      const newEmail = await this.userService.UniqueStringValidatorFromUser(
        teacher.employe.user.id,
        'email',
        data.email,
      );
      if (newUsername === false) data.username === undefined;
      if (newEmail === false) data.email === undefined;
      const newDataTeacher = data;
      const { propsUser, propsEmploye, propsTeacher } =
        this.teacherService.Teacher_Data_Separation(newDataTeacher);
      await this.userService.Update_User_Service(
        teacher.employe.user.id,
        propsUser,
      );
      await this.employeService.Update_Employe_Service(
        teacher.employe.id,
        propsEmploye,
      );
      await this.teacherService.Update_Teacher_Service(
        teacher.id,
        propsTeacher,
      );
      return { ok: true, message: 'El Maestro se edito exitosamente' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('delete/:id')
  @Roles('Administrador de maestros')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Delete_Teacher(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const teacher = await this.teacherService.Sesion_Teacher_With_Jwt(id);
      const message = await this.teacherService.Delete_Teacher_Service(
        teacher.id,
      );
      await this.employeService.Delete_Employe_Service(teacher.employe.id);
      await this.userService.Delete_User_Service(teacher.employe.user.id);
      res.clearCookie('refresh_token');
      return message;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

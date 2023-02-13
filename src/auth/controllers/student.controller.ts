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
import { keysStudentData } from '../helpers/capture_key';

import {
  Create_Student_DTO,
  Update_Private_Data_Student_DTO,
  Update_Public_Data_Student_DTO,
} from '../dto/student_dto';

import StudentService from '../services/student.service';
import UserService from '../services/user.service';
import { Roles } from '../helpers/roles/role.decorator';
import { RolesGuard } from '../helpers/roles/role.guard';

@Controller('auth_student')
export class StudentController {
  constructor(
    private readonly userService: UserService,
    private readonly studentService: StudentService,
  ) {}

  @Post('register')
  @Roles('Administrador de estudiantes')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Register_Student(@Body() data: Create_Student_DTO) {
    try {
      const dataUser = {};
      const dataStudent = {};
      Object.entries(data).forEach(([key, values]) => {
        if (!keysStudentData.includes(key)) dataUser[key] = values;
        else dataStudent[key] = values;
      });
      const user = await this.userService.Create_User_Service(dataUser, 1);
      await this.studentService.Create_Student_Service(user, dataStudent);
      return { ok: true, message: 'Estudiante creado exitosamente' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('public_update')
  @Roles('Estudiante')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Public_Update_Student(
    @Body() data: Update_Public_Data_Student_DTO,
    @Req() req: Request,
  ) {
    try {
      const student = await this.studentService.Sesion_Student_With_Jwt(
        req.user['id'],
      );
      const newUsername = await this.userService.UniqueStringValidatorFromUser(
        student.user.id,
        'username',
        data.username,
      );
      if (newUsername === false) data.username === undefined;
      const newData = data;
      const { propsUser, propsStudent } =
        this.studentService.Student_Data_Separation(newData);
      await this.userService.Update_User_Service(student.user.id, propsUser);
      let newDataStudent: object;
      if (Object.values(propsStudent).length > 0)
        newDataStudent = await this.studentService.Update_Student_Service(
          student.id,
          propsStudent,
        );
      else
        newDataStudent = await this.studentService.Sesion_Student_With_Jwt(
          student.id,
        );
      return newDataStudent;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('private_update/:id')
  @Roles('Administrador de estudiantes')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Private_Update_Student(
    @Body() data: Update_Private_Data_Student_DTO,
    @Param('id') id: number,
  ) {
    try {
      const student = await this.studentService.Sesion_Student_With_Jwt(id);
      const newUsername = await this.userService.UniqueStringValidatorFromUser(
        student.user.id,
        'username',
        data.username,
      );
      const newEmail = await this.userService.UniqueStringValidatorFromUser(
        student.user.id,
        'email',
        data.email,
      );
      if (newUsername === false) data.username === undefined;
      if (newEmail === false) data.email === undefined;
      const newData = data;
      const { propsUser, propsStudent } =
        this.studentService.Student_Data_Separation(newData);
      await this.userService.Update_User_Service(student.user.id, propsUser);
      await this.studentService.Update_Student_Service(
        student.id,
        propsStudent,
      );
      return { ok: true, message: 'El estudiante se actualizo exitosamente' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('delete/:id')
  @Roles('Administrador de estudiantes')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Delete_Student(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const student = await this.studentService.Sesion_Student_With_Jwt(id);
      const message = await this.studentService.Delete_Student_Service(
        student.id,
      );
      await this.userService.Delete_User_Service(student.user.id);
      res.clearCookie('refresh_token');
      return message;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

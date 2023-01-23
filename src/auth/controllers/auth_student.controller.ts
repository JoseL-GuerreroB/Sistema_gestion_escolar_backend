import {
  Body,
  Controller,
  Delete,
  HttpException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

import {
  Create_Student_DTO,
  Update_Private_Data_Student_DTO,
  Update_Public_Data_Student_DTO,
} from '../dto/student_dto';
import {
  keysStudentData,
  propsStudentSchema,
  propsUserSchema,
} from '../helpers/capture_key';

import AuthPreservice from '../services/auth_pre.service';
import AuthStudentService from '../services/auth_student.service';
@Controller('auth_student')
export default class AuthStudentController {
  constructor(
    private readonly authPreservice: AuthPreservice,
    private readonly authStudentService: AuthStudentService,
  ) {}

  @Post('register')
  async Register_Student(
    @Body() newStudent: Create_Student_DTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(newStudent);
    const propsUser = propsUserSchema;
    const propsStudent = propsStudentSchema;
    Object.entries(newStudent).forEach(([key, values]) => {
      if (!keysStudentData.includes(key)) propsUser[key] = values;
      else propsStudent[key] = values;
    });
    try {
      console.log(propsUser, propsStudent);
      const user = await this.authPreservice.Create_User(propsUser, 1);
      const student = await this.authStudentService.Create_Student(
        propsStudent,
        user,
        1,
      );
      await this.authPreservice.generateRefreshToken(
        student.id,
        student.user.type_user.type_user,
        null,
        res,
      );
      const accessToken = await this.authPreservice.generateToken(
        student.id,
        student.user.type_user.type_user,
        null,
      );
      return { accessToken, student };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('update_public')
  @UseGuards(AuthGuard('jwt'))
  async Update_Public_Student(
    @Req() req: Request,
    @Body() newPublicDataStudent: Update_Public_Data_Student_DTO,
  ) {
    try {
      const student = await this.authStudentService.Sesion_Student_With_Jwt(
        req.user['id'],
      );
      const { propsUser, propsStudent } =
        this.authStudentService.Student_Data_Separation(newPublicDataStudent);
      let newDataStudent: object;
      if (Object.values(propsStudent).length === 0)
        newDataStudent = await this.authStudentService.Update_Student(
          student.user.id,
          propsUser,
          student.id,
        );
      else
        newDataStudent = await this.authStudentService.Update_Student(
          student.user.id,
          propsUser,
          student.id,
          propsStudent,
        );
      return { newDataStudent };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('update_private')
  @UseGuards(AuthGuard('jwt'))
  async Update_Private_Student(
    @Req() req: Request,
    @Body() newPrivateDataStudent: Update_Private_Data_Student_DTO,
  ) {
    try {
      const student = await this.authStudentService.Sesion_Student_With_Jwt(
        req.user['id'],
      );
      const { propsUser, propsStudent } =
        this.authStudentService.Student_Data_Separation(newPrivateDataStudent);
      let newDataStudent: object;
      if (Object.values(propsStudent).length === 0)
        newDataStudent = await this.authStudentService.Update_Student(
          student.user.id,
          propsUser,
          student.id,
        );
      else
        newDataStudent = await this.authStudentService.Update_Student(
          student.user.id,
          propsUser,
          student.id,
          propsStudent,
        );
      return { newDataStudent };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('delete')
  @UseGuards(AuthGuard('jwt'))
  async Delete_Student(@Req() req: Request) {
    try {
      const student = await this.authStudentService.Sesion_Student_With_Jwt(
        req.user['id'],
      );
      return this.authStudentService.Del_Student(student.user.id, student.id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

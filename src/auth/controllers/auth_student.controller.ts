import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthStudentService } from '../services/auth_student.service';
import {
  keysStudentData,
  propsStudentSchema,
  propsUserSchema,
} from '../helpers/capture_key';
import { Create_Student_DTO } from '../dto/student_dto';
import { Login_DTO } from '../dto/user_dto';
import { AuthPreservice } from '../services/auth_pre.service';

@Controller('auth')
export class AuthStudentController {
  constructor(
    private readonly authPreservice: AuthPreservice,
    private readonly authStudentService: AuthStudentService,
  ) {}

  @Post('register_student')
  async Register_Student(@Body() newStudent: Create_Student_DTO) {
    let user: boolean | object;
    const propsUser = propsUserSchema;
    const propsStudent = propsStudentSchema;
    Object.entries(newStudent).forEach(([key, values]) => {
      if (!keysStudentData.includes(key)) propsUser[key] = values;
      else propsStudent[key] = values;
    });
    try {
      const incompleteRegister =
        await this.authStudentService.Incomplete_Register_Student(
          propsUser.username,
          propsUser.email,
        );
      if (incompleteRegister === false) {
        user = await this.authPreservice.Create_User(propsUser, 1);
      } else {
        user = incompleteRegister;
      }
      const student = await this.authStudentService.Create_Student(
        propsStudent,
        user,
        1,
      );
      const accessToken = await this.authPreservice.generateToken(
        student.id,
        student.user.type_user.type_user,
      );
      return { accessToken, student };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('login_student')
  async Login(@Body() dataLogin: Login_DTO) {
    try {
      const student = await this.authStudentService.Login_Student(dataLogin);
      const accessToken = await this.authPreservice.generateToken(
        student.id,
        student.user.type_user.type_user,
      );
      return { accessToken, student };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

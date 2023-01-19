import { Body, Controller, Post } from '@nestjs/common';
import { AuthStudentService } from '../services/auth_student.service';
import {
  keysStudentData,
  propsStudentSchema,
  propsUserSchema,
} from '../helpers/capture_key';
import { Create_Student_DTO } from '../dto/student_dto';

@Controller('auth')
export class AuthStudentController {
  constructor(private readonly authStudentService: AuthStudentService) {}

  @Post('register_student')
  async Register_Student(@Body() newStudent: Create_Student_DTO) {
    let user: boolean | object;
    const propsUser = propsUserSchema;
    const propsStudent = propsStudentSchema;
    Object.entries(newStudent).forEach(([key, values]) => {
      if (!keysStudentData.includes(key)) propsUser[key] = values;
      else propsStudent[key] = values;
    });
    const incompleteRegister =
      await this.authStudentService.Incomplete_Register(
        propsUser.username,
        propsUser.email,
      );
    if (incompleteRegister === false) {
      user = await this.authStudentService.Create_User(propsUser, 1);
    } else {
      user = incompleteRegister;
    }
    const student = await this.authStudentService.Create_Student(
      propsStudent,
      user,
      1,
    );
    return { User_Information: user, Student_Information: student };
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { keysStudentData, propsUserSchema } from './capture_key';
import { Create_Student_DTO } from './dto/student_dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register_student')
  Register_Student(@Body() newStudent: Create_Student_DTO) {
    console.log(this.authService);
    const propsUser = propsUserSchema;
    Object.entries(newStudent).forEach(([key, values]) => {
      if (!keysStudentData.includes(key)) propsUser[key] = values;
    });
    const newUser = this.authService.Create_User(propsUser, 1);
    console.log(newUser);
    return this.authService.Register_Student_Service(newStudent);
  }
}

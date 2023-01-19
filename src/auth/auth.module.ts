import { Module } from '@nestjs/common';
import { AuthStudentService } from './services/auth_student.service';
import { AuthStudentController } from './controllers/auth_student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from './entities/user.entity';
import Students from './entities/student.entity';
import Employees from './entities/employe.entity';
import Teachers from './entities/teacher.entity';
import { TypesUsers } from './entities/type_atr.entity';
import { StatusStudents } from './entities/status_atr.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      TypesUsers,
      Students,
      Employees,
      Teachers,
      StatusStudents,
    ]),
  ],
  controllers: [AuthStudentController],
  providers: [AuthStudentService],
  exports: [AuthStudentService],
})
export class AuthModule {}

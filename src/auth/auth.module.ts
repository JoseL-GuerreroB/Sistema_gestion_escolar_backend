import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import Users from './entities/user.entity';
import Students from './entities/student.entity';
import Employees from './entities/employe.entity';
import Teachers from './entities/teacher.entity';
import {
  TypesEmployees,
  TypesJobs,
  TypesUsers,
} from './entities/type_atr.entity';
import { StatusEmployees, StatusStudents } from './entities/status_atr.entity';
import Jobs from './entities/job.entity';

import SesionsController from './controllers/sesion.controller';
import { StudentController } from './controllers/student.controller';
import TeacherController from './controllers/teacher.controller';

import UserService from './services/user.service';
import StudentService from './services/student.service';
import EmployeService from './services/employe.service';
import TeacherService from './services/teacher.service';
import TokenService from './services/token.service';

import AccessTokenStrategy from './helpers/strategies/accessToken.strategy';
import RefreshAccessTokenStrategy from './helpers/strategies/refreshAccessToken.strategy';
import PasswordTokenStrategy from './helpers/strategies/tokenPassword.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      Users,
      TypesUsers,
      TypesEmployees,
      TypesJobs,
      Students,
      Employees,
      Teachers,
      StatusStudents,
      StatusEmployees,
      Jobs,
    ]),
  ],
  controllers: [SesionsController, StudentController, TeacherController],
  providers: [
    PasswordTokenStrategy,
    RefreshAccessTokenStrategy,
    AccessTokenStrategy,
    TokenService,
    UserService,
    StudentService,
    EmployeService,
    TeacherService,
  ],
  exports: [StudentService],
})
export class AuthModule {}

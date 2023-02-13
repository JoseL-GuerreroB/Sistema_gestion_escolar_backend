import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import Users from './entities/user.entity';
import Students from './entities/student.entity';
import Employees from './entities/employe.entity';
import Teachers from './entities/teacher.entity';
import {
  TypesAdministrators,
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
import Administrators from './entities/administrator.entity';
import { Roles } from './entities/authorization.entity';
import AdministratorController from './controllers/administrator.controller';
import AdministratorService from './services/administrator.service';

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
      TypesAdministrators,
      Administrators,
      Roles,
    ]),
  ],
  controllers: [
    SesionsController,
    StudentController,
    TeacherController,
    AdministratorController,
  ],
  providers: [
    PasswordTokenStrategy,
    RefreshAccessTokenStrategy,
    AccessTokenStrategy,
    TokenService,
    UserService,
    StudentService,
    EmployeService,
    TeacherService,
    AdministratorService,
  ],
  exports: [StudentService],
})
export class AuthModule {}

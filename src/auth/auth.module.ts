import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Users from './entities/user.entity';
import Students from './entities/student.entity';
import Employees from './entities/employe.entity';
import Teachers from './entities/teacher.entity';
import { TypesEmployees, TypesUsers } from './entities/type_atr.entity';
import { StatusEmployees, StatusStudents } from './entities/status_atr.entity';
import Jobs from './entities/job.entity';

import AuthStudentController from './controllers/auth_student.controller';
import SesionsController from './controllers/sesion.controller';

import AuthStudentService from './services/auth_student.service';
import AuthPreservice from './services/auth_pre.service';

import { JwtModule } from '@nestjs/jwt';
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
      Students,
      Employees,
      Teachers,
      StatusStudents,
      StatusEmployees,
      Jobs,
    ]),
  ],
  controllers: [SesionsController, AuthStudentController],
  providers: [
    PasswordTokenStrategy,
    RefreshAccessTokenStrategy,
    AccessTokenStrategy,
    AuthPreservice,
    AuthStudentService,
  ],
  exports: [AuthStudentService],
})
export class AuthModule {}
